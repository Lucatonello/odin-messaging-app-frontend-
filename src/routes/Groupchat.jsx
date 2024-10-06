import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

function Groupchat() {
    const [messages, setMessages] = useState([])
    const { id } = useParams();
    const token = localStorage.getItem('token');

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
    return (
        <div>
            <ul>
                {messages.map((message) => (
                    <li key={message.id}>
                        <p>{message.text}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Groupchat;