import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import '../AddContact.css';

// eslint-disable-next-line react/prop-types
function AddContact({ onHide }) {
    const [newMessage, setNewMessage] = useState("");
    const [receiver, setReceiver] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [notification, setNotification] = useState("");

    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('username');

    useEffect(() => {
        fetch('https://odin-messaging-app-backend-production.up.railway.app/getUsers')
          .then(res => res.json())
          .then(data => setFilteredUsers(data))
          .catch(err => console.error(err))
    }, []);
    
    const handleSend = async (e) => {
        e.preventDefault();

        if (token) {
            const decoded = jwtDecode(token);
            const senderId = decoded.id;

           await fetch(`https://odin-messaging-app-backend-production.up.railway.app/getReceiverId`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ receiver })
            })
              .then(res => res.json())
              .then(async (data) => {
                const fetchedReceiverId = data.id;
                console.log('this is the receiver id', fetchedReceiverId);

                if (fetchedReceiverId) {
                    const response = await fetch(`https://odin-messaging-app-backend-production.up.railway.app/newMessage/${senderId}/${fetchedReceiverId}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({ newMessage })
                    })
                    const result = await response.json();
                    if (result.isDone) {
                        window.location.reload();
                    }
                } else {
                    console.error('ReceiverId not found')
                }      
              })
              .catch((error) => console.error('Error fetching receiver ID:', error));
        }
    };
    
    const handleUserSelect = (e) => {
        const selectedReceiver = e.target.value;
        setReceiver(selectedReceiver);
    };
    useEffect(() => {
        console.log('state of receiver:', receiver);
        console.log('state of notification:', notification);

    }, [receiver, notification])
    return (
        <div className="messageFormContainer">
          <form className="messageForm" onSubmit={handleSend}>
            <label htmlFor="to">To:</label>
            <select value={receiver} onChange={handleUserSelect} required>
                <option value="" disabled></option>
                {filteredUsers.filter(member => member.username !== currentUser).map((user) => (
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
            <button style={{ marginBottom: '5px'}} type="submit" onClick={() => {
                setNotification('Message Sent');
            }}
            >Send</button>
            <button onClick={onHide} id="hideButton">Cancel</button>
            {notification && <p style={{ textAlign: 'center', color: '#007bff' }}>{notification}</p>}
          </form>
        </div>
      );
}

export default AddContact;