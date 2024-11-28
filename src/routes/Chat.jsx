import arrow from '../img/back-arrow.png';
import bottomArrow from '../img/up-arrow.png';
import defaultPfp from '../img/user.png';
import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom'; 
import styles from '../Chat.module.css'

function Chat() {
    const [chat, setChat] = useState([]);
    const [pfp, setPfp] = useState("");    
    const [userId, setUserId] = useState(null);
    const [contactName, setContactName] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const { contactid } = useParams();
    const messagesEndRef = useRef(null); 

    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
            
            // Fetch chat messages and contact name
            fetch(`https://odin-messaging-app-backend-production.up.railway.app/chat/${contactid}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                }
            })
            .then(res => res.json())
            .then(data => {
                setChat(data);
                setPfp(userId == data[0].senderid ? data[0].receiver_profilepic : data[0].sender_profilepic);
                if (data.length > 0) {
                    const contact = data[0].senderid === decoded.id
                        ? data[0].receiver_username
                        : data[0].sender_username; 
                    
                    setContactName(contact); 
                }
            })
            .catch(error => console.error('Fetch error:', error));
        } else {
            navigate('/login')
        }
    }, [contactid, token, userId, navigate]);

    const handleNewMessage = async (e) => {
        e.preventDefault();

        const newMessageData = {
            id: chat.length + 1,
            text: newMessage,
            sentat: new Date().toISOString(),
            sender_username: currentUser,
            senderid: userId
        };
        setNewMessage("");

        setChat((prevChat) => [...prevChat, newMessageData]);
        try {
            await fetch(`https://odin-messaging-app-backend-production.up.railway.app/newMessage/${userId}/${contactid}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ newMessage })
            });
            
        } catch (err) {
            console.error(err);
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const icon = {
        height: '35px',
        width: '35px',
        borderRadius: '50%',
        cursor: 'pointer'
    };

    return (
        <div className={!showProfile ? styles.chatContainer : styles.chatContainer2}>
            <div className={styles.topbar}>
                <img src={arrow} alt="<-" style={icon} onClick={() => navigate('/')}/>
                <img 
                    src={pfp ? pfp : defaultPfp}
                    alt="pfp" style={icon} 
                    onClick={() => setShowProfile(true)} 
                />
                <h1 className={styles.chatName}>
                    {contactName ? contactName : "Loading..."}
                </h1>
            </div>
            <ul>
                {chat.map((c) => (
                    <li key={c.id} className={c.senderid === userId ? styles.rightSideli : styles.leftSideli}>
                        <p className={styles.sender}>{c.senderid !== userId ? c.sender_username : ''}</p>
                        <div className={c.senderid === userId ? styles.rightSide : styles.leftSide}>
                            <p>{c.text}</p>
                        </div>
                    </li>
                ))}
                <div ref={messagesEndRef} /> {/* Dummy div at the end of the list */}
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
    );
}

export default Chat;
