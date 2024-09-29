import arrow from '../img/back-arrow.png';
import bottomArrow from '../img/up-arrow.png';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';
import '../Chat.css';

function Chat() {
    const [chat, setChat] = useState([]);
    console.log('chat.senderid: ', chat.senderid)

    const [userId, setUserId] = useState(null);
    const [contactName, setContactName] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const { contactid } = useParams();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            console.log('decoded user id before asignign: ', decoded);
            setUserId(decoded.id); // Set logged-in user ID
            console.log('State after: ', userId);
            
            // Fetch chat messages and contact name
            fetch(`http://localhost:3000/chat/${contactid}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                }
            })
            .then(res => res.json())
            .then(data => {
                setChat(data);
                console.log('data', data);
                // Find the contact's name based on the current user
                if (data.length > 0) {
                    const contact = data[0].senderid === decoded.id
                        ? data[0].receiver_username // Current user is sender, so get receiver's name
                        : data[0].sender_username;  // Current user is receiver, so get sender's name
                    
                    setContactName(contact); // Set the contact's name
                }
            })
            .catch(error => console.error('Fetch error:', error));
        }
    }, [contactid, token, userId]);

    const handleNewMessage = async () => {
        try {
            await fetch(`http://localhost:3000/newMessage/${userId}/${contactid}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ newMessage })
            })
            setNewMessage("");
        } catch (err) {
            console.error(err);
        }
    };
    const icon = {
        height: '35px',
        width: '35px',
    };

    return (
        <div>
            <div className='topbar'>
                <img src={arrow} alt="<-" style={icon} onClick={() => navigate('/')}/>
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" 
                    alt="pfp" style={icon} 
                    onClick={() => setShowProfile(true)} 
                />
                <h1 className='chatName'>
                    {contactName ? contactName : "Loading..."} {/* Display contact name */}
                </h1>
                
            </div>
            <ul>
                {chat.map((c) => (
                    <li key={c.id} className={c.senderid === userId ? 'rightSideli' : 'leftSideli'}>
                        <div className={c.senderid === userId ? 'rightSide' : 'leftSide'}>
                            <p>{c.text}</p>
                            {/* <p>{c.sentat}</p> */}
                        </div>
                    </li>
                ))}
            </ul>
            <div className='bottombar'>
                <form onSubmit={handleNewMessage}>
                    <input
                        type="text"
                        name="newMessage"
                        placeholder="Message"
                        value={newMessage}
                        onChange={(e) => { setNewMessage(e.target.value) }}
                    />
                    {newMessage && (
                        <button className='send' type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0px', padding: '0px', height: '30px' }}>
                            <img className='send' src={bottomArrow} alt="Send" style={{ width: '30px', height: '30px' }} />
                        </button>
                    )}
                </form>
            </div>
            {showProfile && (
                <div>
                    <Profile  contactid={contactid} />
                    <button onClick={() => setShowProfile(false)}>Hide</button>
                </div>
            )}
        </div>
    )
}

export default Chat;