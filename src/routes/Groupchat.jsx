import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import arrow from '../img/back-arrow.png';
import bottomArrow from '../img/up-arrow.png';
import defaulfPfp from '../img/user.png';
import { useNavigate } from 'react-router-dom';  
import styles from '../Groupchat.module.css';   
import GroupchatDetails from './GroupchatDetails';

function Groupchat() {
    const [messages, setMessages] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [groupMetadata, setGroupMetadata] = useState([]);
    const { id } = useParams();
    const chatContainerRef = useRef(null);
    const messagesEndRef = useRef(null); 

    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
        }
    }, [token]);

    // Get group messages
    useEffect(() => {
        fetch(`https://odin-messaging-app-backend-production.up.railway.app/groupChat/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(data => {
            setMessages(data);
        });
    }, [id, token]);

    // Get group metadata
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
                setGroupMetadata(data);
            })
            .catch(error => console.error('Fetch error:', error));
        } 
    }, [token, userId]);

    const handleNewMessage = async (e) => {
        e.preventDefault();
        const newMessageData = {
            id: messages.length + 1,
            text: newMessage,
            sentat: new Date().toISOString(),
            sender_username: currentUser,
            senderid: userId
        };
        setMessages((prevMessages) => [...prevMessages, newMessageData]);
        setNewMessage("");

        try {
            await fetch(`https://odin-messaging-app-backend-production.up.railway.app/newGroupChatMessage/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ newMessage: newMessage, userId: userId })
            });
        } catch (err) {
            console.error(err);
        }
    };
    
    const icon = {
        height: '35px',
        width: '35px',
        borderRadius: '50%',
        cursor: 'pointer'
    };

    return (
        <div ref={chatContainerRef} className={styles.chatContainer}>
            <div className={styles.topbar}>
                <img src={arrow} alt="<-" style={icon} onClick={() => navigate('/')}/>
                {groupMetadata.length !== 0 && (
                    <ul className={styles.pfpContainer}>
                        {groupMetadata.map((i, index) => ( 
                            <li key={index}>
                                {i.id == id && (
                                    i.profilepics.slice(0, 13).map((pic, index) => (
                                        <img key={index} src={pic ? pic : defaulfPfp} alt="pfp" 
                                        style={{ height: '35px', width: '35px', marginRight: '10px', borderRadius: '50%', cursor: 'pointer' }} 
                                        onClick={() => setShowDetails(true)}
                                        />
                                    )) 
                                )}  
                                <h1 style={{ margin: '0' }}>{(i.name && i.id == id) && i.name }</h1>
                            </li>
                        ))} 
                    </ul>
                )}
            </div>
            <div className={!showDetails ? styles.messagesContainer : styles.messagesContainer2}>
                <ul className={styles.messagesUl}>    
                    {messages.map((message) => (
                        <li key={message.id} className={message.senderid === userId ? styles.rightSideli : styles.leftSideli}>
                            <p className={styles.sender}>{message.senderid !== userId ? message.username: ''}</p>
                            <p className={message.senderid === userId ? styles.rightSide : styles.leftSide}>{message.text}</p>
                        </li>
                    ))}
                    {/* Dummy div for scrolling */}
                    <div ref={messagesEndRef} /> 
                </ul>    
            </div>

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
                </form>
            </div>
            {showDetails && <GroupchatDetails onHide={() => setShowDetails(false)} groupId={id} />}
        </div>
    );
}

export default Groupchat;
