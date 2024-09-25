import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Index() {
    const [chats, setChats] = useState([]);
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
    return (
      <>
        <ul>
            {chats.map((chat) => (
                <li key={chat.id} > 
                  <div onClick={() => navigate(`/chat/${chat.id}`)}>
                    <h1>{chat.username}</h1>
                  </div>
                </li>
            ))} 
        </ul>
      </>
    )
}

export default Index;