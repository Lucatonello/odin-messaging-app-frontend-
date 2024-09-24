import { useState, useEffect } from "react";

function Index() {
    const [chats, setChats] = useState([]);
    const token = localStorage.getItem('token');

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
                <li key={chat.id}> 
                    <h1>{chat.username}</h1>
                </li>
            ))} 
        </ul>
      </>
    )
}

export default Index;