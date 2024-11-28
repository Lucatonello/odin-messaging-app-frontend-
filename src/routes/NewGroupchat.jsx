import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import '../AddContact.css';
import styles from '../NewGroupChat.module.css';

// eslint-disable-next-line react/prop-types
function NewGroupChat({ onHide }) {
    const [groupName, setGroupName] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [description, setDescription] = useState("");
    const [userID, setUserID] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [notification, setNotification] = useState("");

    const currentUser = localStorage.getItem('username');
    console.log('currentUser', currentUser);
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setUserID(decoded.id);
        }
        fetch('https://odin-messaging-app-backend-production.up.railway.app/getUsers')
          .then(res => res.json())
          .then(data => setAllUsers(data))
          .catch(err => console.error(err))
    }, [userID, token]);

    const handleMembersChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const selectedUsers = selectedOptions.map(option => option.value);
        setGroupMembers(selectedUsers);
    }
    console.log('all users', allUsers);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newGroupChat = {
            name: groupName,
            description,
            members: groupMembers
        };

        const response = await fetch(`https://odin-messaging-app-backend-production.up.railway.app/createGroupChat/${userID}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json', 
            },
            body: JSON.stringify(newGroupChat)
        })
        const result = await response.json();
        if (result.isDone) {
            window.location.reload();
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">* Group name: </label>
                <input 
                    type="text"
                    value={groupName}
                    maxLength={40}
                    onChange={(e) => setGroupName(e.target.value)} 
                    required
                />

                <label htmlFor="members">Group members: </label>
                <select multiple onChange={handleMembersChange}>
                    {allUsers.filter(member => member.username !== currentUser).map((user) => (
                        <option key={user.id} value={user.username}>
                            {user.username}
                        </option>                       
                    ))}
                </select>

                <label htmlFor="description">Description: </label>
                <input 
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} 
                />

                <button type="submit" className={styles.button} onClick={() => setNotification('Group Chat Created')}>Create</button>
                <button onClick={onHide} className={styles.cancelButton}>Cancel</button>
                {notification && <p style={{ textAlign: 'center', color: '#007bff'}}>{notification}</p>}
            </form>
        </div>
    )

}

export default NewGroupChat;