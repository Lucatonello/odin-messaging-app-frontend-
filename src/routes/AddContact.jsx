import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import '../AddContact.css';

// eslint-disable-next-line react/prop-types
function AddContact({ onHide }) {
    const [newMessage, setNewMessage] = useState("");
    const [receiver, setReceiver] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('username');

    useEffect(() => {
        fetch('https://odin-messaging-app-backend.onrender.com/getUsers')
          .then(res => res.json())
          .then(data => setFilteredUsers(data))
          .catch(err => console.error(err))
    }, []);
    
    const handleSend = async (e) => {
        e.preventDefault();

        if (token) {
            const decoded = jwtDecode(token);
            const senderId = decoded.id;

           await fetch(`https://odin-messaging-app-backend.onrender.com/getReceiverId`, {
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
                    await fetch(`https://odin-messaging-app-backend.onrender.com/newMessage/${senderId}/${fetchedReceiverId}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({ newMessage })
                    })
                    // .then(window.location.reload())
                    .then(setNewMessage(""))
                } else {
                    console.error('ReceiverId not found')
                }      
              })
              .catch((error) => console.error('Error fetching receiver ID:', error));
        }
    };

    const handleUserSelect = (e) => {
        setReceiver(e.target.value);
        console.log('state of receiver:', receiver);
    };
    return (
        <div className="messageFormContainer">
          <form className="messageForm" onSubmit={handleSend}>
            <label htmlFor="to">To:</label>
            <select value={receiver} onChange={handleUserSelect} required>
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
            <button style={{ marginBottom: '5px'}} type="submit">Send</button>
            <button onClick={onHide} id="hideButton">Cancel</button>
          </form>
        </div>
      );
}

export default AddContact;