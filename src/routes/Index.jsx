import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../Index.css';
import addContactIcon from '../img/add-contact.png'
import AddContact from './AddContact';

function Index() {
    const [chats, setChats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddContact, setShowAddContact] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
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
    }, [token]);

    const filteredChats = chats.filter(chat =>
      chat.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <>
        <div className="chatListHeader">
          <input
            type="text"
            className="searchBar"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <img 
            src={addContactIcon} 
            alt="Add Contact" 
            className="addContactIcon" 
            onClick={() => setShowAddContact(true)} 
          />
        </div>
  
        <ul className="chatList">
          {filteredChats.map((chat) => (
            <li key={chat.id} className="chatItem">
              <div className="chatContainer" onClick={() => navigate(`/chat/${chat.id}`)}>
                <h1 className="chatUsername">{chat.username}</h1>
              </div>
            </li>
          ))}
        </ul>
        {showAddContact && (
          <div>
            <AddContact />
            <button onClick={() => setShowAddContact(false)}>Hide</button>
          </div>
        )}
        
      </>
    );
}

export default Index;