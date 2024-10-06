import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import arrow from '../img/back-arrow.png';
import { useNavigate } from 'react-router-dom';  
import styles from '../Groupchat.module.css';   

function Groupchat() {
    const [messages, setMessages] = useState([])
    const [showInfo, setShowInfo] = useState(false);
    const [userId, setUserId] = useState(null);
    const [groupMetadata, setGroupMetadata] = useState([])
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
          const decoded = jwtDecode(token);
            console.log('decoded.id', decoded.id);
            setUserId(decoded.id);
        }
      }, [token]);

    //get group messages
    useEffect(() => {
        fetch(`http://localhost:3000/groupChat/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json',
            }
        })
          .then(res => res.json())
          .then(data => {
            console.log('fetch data: ', data);
            setMessages(data)
          })
    }, [id, token]);

    //get group metadata
    useEffect(() => {
        if (userId && token) {
          fetch(`http://localhost:3000/getUserGroupChats/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-type': 'application/json',
            }
          })
            .then(res => res.json())
            .then(data => {
                setGroupMetadata(data);
              console.log('metadata: ', data)
            })
            .catch(error => console.error('Fetch error:', error))
        } 
      }, [token, userId]);

    const icon = {
        height: '35px',
        width: '35px',
        borderRadius: '50%',
        cursor: 'pointer'
    };

    return (
        <div>
            <div className={styles.topbar}>
                <img src={arrow} alt="<-" style={icon} onClick={() => navigate('/')}/>
                {groupMetadata.length !== 0 && (
                    <ul className={styles.pfpContainer}>
                        {groupMetadata[0].profilepics.map((pic, index) => (
                            <li key={index}>
                                <img key={index} src={pic} alt="pfp" style={{ height: '35px', width: '35px', marginRight: '10px', borderRadius: '50%', cursor: 'pointer' }} />
                            </li>
                        ))}
                        <h1 style={{ margin: '0px 0px 0px 10px' }}>{groupMetadata[0] ? groupMetadata[0].name : 'Loading...' }</h1>

                    </ul>
                )}
                {/* <img 
                    src={groupMetadata}
                    alt="pfp" style={icon} 
                    onClick={() => setShowInfo(true)} 
                /> */}
            </div>
            <div className={styles.messagesContainer}>
                <ul>    
                    {messages.map((message) => (
                        <li key={message.id} className={message.senderid === userId ? styles.rightSideli : styles.leftSideli}>
                            <p className={message.senderid == userId ? styles.rightSide : styles.leftSide}>{message.text}</p>
                        </li>
                    ))}
                </ul>    
            </div>
        </div>
    )
}

export default Groupchat;