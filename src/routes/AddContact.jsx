import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import '../AddContact.css';

function AddContact({ onHide }) {
    const [newMessage, setNewMessage] = useState("");
    const [receiver, setReceiver] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [receiverId, setReceiverId] = useState(null);
    const token = localStorage.getItem('token');


    useEffect(() => {
        fetch('http://localhost:3000/getUsers')
          .then(res => res.json())
          .then(data => setFilteredUsers(data))
          .catch(err => console.error(err))
    }, []);
    
    const handleSend = async (e) => {
        e.preventDefault();

        if (token) {
            const decoded = jwtDecode(token);
            const senderId = decoded.id;

            const response = await fetch(`http://localhost:3000/getReceiverId`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ receiver })
            });

            const data = await response.json();
            console.log('data, receiver id: ', data.id);
            setReceiverId(data.id);

             if (data.id) {
                await fetch(`http://localhost:3000/newMessage/${senderId}/${data.id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ newMessage })
                });
                setNewMessage("");
            } else {
                console.error('ReceiverId not found')
            }      
        }
    };

    const handleUserSelect = (e) => {
        setReceiver(e.target.value);
    };

    return (
        <div className="messageFormContainer">
          <form className="messageForm" onSubmit={handleSend}>
            <label htmlFor="to">To:</label>
            <select value={receiver} onChange={handleUserSelect} required>
                {filteredUsers.map((user) => (
                    <option key={user.id} value={user.username}>
                        {user.username}
                    </option>
                ))}
            </select>
            <hr className="formDivider" />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message"
              required
            />
            <button style={{ marginBottom: '5px'}} type="submit">Send</button>
            <button onClick={onHide} id="hideButton">Cancel</button>
          </form>
        </div>
      );
}

export default AddContact;