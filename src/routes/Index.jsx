import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../index.css';
import Profile from './Profile';
import AddContact from './AddContact';
import NewGroupChat from './NewGroupchat';
import addContactIcon from '../img/add-contact.png'
import group from '../img/group.png';
import logout from '../img/logoute.png'
import defaulfPfp from '../img/user.png'

function Index() {
    const [chats, setChats] = useState([]);
    const [groupChats, setGroupChats] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddContact, setShowAddContact] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [userId, setUserId] = useState(null);
    const [profilePic, setProfilePic] = useState("");
    const [showGC, setShowNewGC] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
      if (token) {
        const decoded = jwtDecode(token);
          console.log('decoded.id', decoded.id);
          setUserId(decoded.id);
      } else {
        navigate('/signup');
      }
    }, [token, navigate]);

    useEffect(() => {
      if (userId && token) {
        fetch('https://odin-messaging-app-backend-production.up.railway.app/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(data => {
            setChats(data.contacts);
            setIsLoading(false);

            const currentUser = data.currentUser;
            console.log('current user', currentUser);
  
            if (currentUser) {
              setProfilePic(currentUser.profilepic);
              console.log('profilePic', currentUser.profilepic);
            }
          })
          .catch(error => console.error('Fetch error:', error));
      }
    }, [token, userId]);
    
    useEffect(() => {
      if (userId && token) {
        fetch(`https://odin-messaging-app-backend-production.up.railway.app/getUserGroupChats/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json',
          }
        })
          .then(res => res.json())
          .then(data => {
            setGroupChats(data)
            console.log('groupchats: ', data)
          })
          .catch(error => console.error('Fetch error:', error))
      } 
    }, [token, userId]);

    const filteredChats = chats.filter(chat =>
      chat.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
    };

    return (
      <>
        <div className="layoutContainer">
          <div className="mainContent">
            <div className={!showProfile ? "chatListHeader" : "chatListHeader2"}>
              <input
                type="text"
                className={!showProfile ? "searchBar" : "searchBar2"}
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="iconGroup">
                <img 
                  src={addContactIcon} 
                  alt="Add Contact" 
                  className="addContactIcon" 
                  onClick={() => setShowAddContact(true)} 
                />
                <img 
                  src={profilePic ? profilePic : defaulfPfp} 
                  alt="Profile" 
                  style={{ borderRadius: '50%', cursor: 'pointer' }}
                  className="addContactIcon" 
                  onClick={() => {
                    setShowProfile(true)
                    setShowNewGC(false)
                  }} 
                />
                <img 
                  src={group} 
                  alt="group"
                  className="addContactIcon"
                  onClick={() => {
                    setShowNewGC(true)
                    setShowProfile(false)
                  }}
                />
                <img 
                  src={logout} 
                  alt="Logout" 
                  className="addContactIcon" 
                  onClick={handleLogout} 
                />
                </div>
            </div>

            {!isLoading && chats && chats.length > 0 ? (
              <ul className="chatList">
                {filteredChats.map((chat) => (
                  <li key={chat.id} className="chatItem">
                    <div className="chatContainer" onClick={() => navigate(`/chat/${chat.id}`)}>
                      <img src={chat.profilepic ? chat.profilepic : defaulfPfp} style={{ height: '35px', width: '35px', marginRight: '10px', borderRadius: '50%', cursor: 'pointer' }} />
                      <h1 className="chatUsername">{chat.username}</h1>
                    </div>
                  </li>
                ))}
              </ul>
            ) : isLoading ? (
                <div className="noChatsMessage">
                  <h1>Loading...</h1>
                </div>
            ) : chats && chats.length == 0 && (
              <div className="noChatsMessage">
                <h1>No chats yet...</h1>
                <button className="sendFirstTextButton" onClick={() => setShowAddContact(true)}>Send your first text</button>
              </div>
            )}
             <hr />
             <h1>{groupChats.length !== 0 ? 'Group Chats:' : '' }</h1>
            {groupChats.length !== 0 && (
              <ul className="chatList">
                {groupChats.map((groupchat) => (
                    <li className="chatItem" key={groupchat.id} onClick={() => navigate(`/groupChat/${groupchat.id}`)}>
                      <div className="pictures">
                          {groupchat.profilepics.slice(0, 4).map((pic, index) => (
                            <img key={index} src={pic ? pic : defaulfPfp} style={{ height: '35px', width: '35px', marginRight: '10px', borderRadius: '50%', cursor: 'pointer' }} />
                          ))}
                      </div>
                      <div className="groupName">
                          <h1 className="chatUsername">{groupchat.name}</h1>
                      </div>
                      
                    </li>
                ))}
              </ul>
             )}
            {showAddContact && (
              <div>
                <AddContact onHide={() => setShowAddContact(false)} />
              </div>
            )}
          </div>

          {showProfile && (
            <div className="sidebar">
              <Profile contactid={userId} admin={true} onHide={() => setShowProfile(false)} />
            </div>
          )}
          {showGC && (
            <div>
              <NewGroupChat onHide={() => setShowNewGC(false)} />
            </div>
          )}
        </div>
      </>

    );
}

export default Index;