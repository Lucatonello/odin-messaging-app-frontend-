import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../Index.css';
import Profile from './Profile';
import AddContact from './AddContact';
import addContactIcon from '../img/add-contact.png'
import defaultPfp from '../img/user.png';
import logout from '../img/logoute.png'

function Index() {
    const [chats, setChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddContact, setShowAddContact] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [userId, setUserId] = useState(null);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
      if (token) {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      }
    }, [token]);

    useEffect(() => {
      if (token) {
          fetch('http://localhost:3000/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json',
            },
        })
          .then(res => res.json())
          .then(data => {
            setChats(data)
            console.log(data);
          })
          .catch(error => console.error('Fetch error:', error));
        } else {
          navigate('/login')
        }
        
    }, [token, navigate]);
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
                  src={defaultPfp} 
                  alt="Profile" 
                  className="addContactIcon" 
                  onClick={() => setShowProfile(true)} 
                />
                <img 
                  src={logout} 
                  alt="Logout" 
                  className="addContactIcon" 
                  onClick={handleLogout} 
                />
                </div>
            </div>

            {chats.length !== 0 ? (
              <ul className="chatList">
                {filteredChats.map((chat) => (
                  <li key={chat.id} className="chatItem">
                    <div className="chatContainer" onClick={() => navigate(`/chat/${chat.id}`)}>
                      <img src={chat.profilepic} style={{ height: '35px', width: '35px', marginRight: '10px'}} alt="" />
                      <h1 className="chatUsername">{chat.username}</h1>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="noChatsMessage">
                <h1>No chats yet...</h1>
                <button className="sendFirstTextButton" onClick={() => setShowAddContact(true)}>Send your first text</button>
              </div>
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
        </div>
      </>

    );
}

export default Index;