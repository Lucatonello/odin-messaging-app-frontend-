import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../Chat.css';

function Chat() {
    const [chat, setChat] = useState([]);
    const [userId, setUserId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const { contactid } = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token)
            setUserId(decoded.id);
            console.log('decoded: ', decoded.id)
            console.log('userID state: ', userId);
            console.log('contact id', contactid);
        }

        fetch(`http://localhost:3000/chat/${contactid}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json',
            }
        })
          .then(res => res.json())
          .then(data => {
            setChat(data)
            console.log(data)
          })
          .catch(error => console.error('Fetch error:', error));
    }, [contactid, token, userId]);

    const handleNewMessage = async () => {
        try {
            await fetch(`http://localhost:3000/newMessage/${userId}/${contactid}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Barer ${token}`,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ newMessage })
            })
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <ul>
                {chat.map((c) => (
                    <li key={c.id}>
                        <div className={c.sender_id == userId ? 'rightSide' : 'leftSide'}>
                            <p>{c.text}</p>
                            {/* <p>{c.sentat}</p> */}
                        </div>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleNewMessage}>
                <input
                    type="text"
                    name="newMessage"
                    placeholder="Message"
                    value={newMessage}
                    onChange={(e) => {setNewMessage(e.target.value)}}
                />
                {newMessage && (
                    <button type="submit">Send</button>
                )}
            </form>
        </div>
    )
}

export default Chat;