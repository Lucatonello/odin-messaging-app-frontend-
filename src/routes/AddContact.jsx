import { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function AddContact() {
    const [newMessage, setNewMessage] = useState("");
    const [reciever, setReciever] = useState("");
    const [recieverId, setRecieverId] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleSend = async (e) => {
        e.preventDefault();

        if (token) {
            const decoded = jwtDecode(token);
            const senderId = decoded.id;

            const response = await fetch(`http://localhost:3000/getRecieverId`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ reciever })
            });

            const data = await response.json();
            console.log('data, reciever id: ', data.id);
            setRecieverId(data.id);

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
                console.error('RecieverId not found')
            }      
        }
    };
    return (
        <div>
            <form onSubmit={handleSend}>
                <label htmlFor="to">To: </label>
                <input 
                    type="text" 
                    value={reciever}
                    onChange={(e) => setReciever(e.target.value)}
                    required
                />
                <hr />
                <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message"
                    required
                />
                <button type="submit">Send</button>
            </form>
            
        </div>
    )
}

export default AddContact;