import arrow from '../img/back-arrow.png';
import bottomArrow from '../img/up-arrow.png';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Profile from './Profile';
import defaultPfp from '../img/user.png';
import { useNavigate } from 'react-router-dom'; 
import styles from '../Chat.module.css'

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
        } else {
            navigate('/login')
        }
    }, [contactid, token, userId, navigate]);

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
        <div className={ !showProfile ? styles.chatContainer : styles.chatContainer2 }>
            <div className={styles.topbar}>
                <img src={arrow} alt="<-" style={icon} onClick={() => navigate('/')}/>
                <img 
                    src={defaultPfp}
                    alt="pfp" style={icon} 
                    onClick={() => setShowProfile(true)} 
                />
                <h1 className={styles.chatName}>
                    {contactName ? contactName : "Loading..."} {/* Display contact name */}
                </h1>
            </div>
            <ul>
                {chat.map((c) => (
                    <li key={c.id} className={c.senderid === userId ? styles.rightSideli : styles.leftSideli}>
                        <div className={c.senderid === userId ? styles.rightSide : styles.leftSide}>
                            <p>{c.text}</p>
                            {/* <p>{c.sentat}</p> */}
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles.bottombar}>
                <form onSubmit={handleNewMessage}>
                    <input
                        type="text"
                        name="newMessage"
                        placeholder="Message"
                        value={newMessage}
                        onChange={(e) => { setNewMessage(e.target.value) }}
                    />
                    {newMessage && (
                        <button className={styles.send} type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', margin: '0px', padding: '0px', height: '30px' }}>
                            <img className={styles.send} src={bottomArrow} alt="Send" style={{ width: '30px', height: '30px' }} />
                        </button>
                    )}
                    {showProfile && (
                        <div className={styles.hideProfileContainer}>
                            <Profile contactid={contactid} admin={false} onHide={() => setShowProfile(false)}/>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Chat;