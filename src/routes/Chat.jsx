import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

function Chat() {
    const [chat, setChat] = useState([]);
    const { contactid } = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
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
    }, [contactid, token]);

    return (
        <div>
            <ul>
                {chat.map((c) => (
                    <li key={c.id}>
                        <div>
                            <p>{c.text}</p>
                            <p>{c.sentat}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Chat;