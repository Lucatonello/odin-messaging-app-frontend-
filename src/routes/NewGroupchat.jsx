import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import '../AddContact.css';
import styles from '../NewGroupChat.module.css';

function NewGroupChat({ onHide }) {
    const [groupName, setGroupName] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [description, setDescription] = useState("");
    const [userID, setUserID] = useState(null);
    const [allUsers, setAllUsers] = useState([]);

    const token = localStorage.getItem('token');
    
    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setUserID(decoded.id);
        }
        fetch('http://localhost:3000/getUsers')
          .then(res => res.json())
          .then(data => setAllUsers(data))
          .catch(err => console.error(err))
    }, [userID, token]);

    const handleMembersChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const selectedUsers = selectedOptions.map(option => option.value);
        setGroupMembers(selectedUsers);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newGroupChat = {
            name: groupName,
            description,
            members: groupMembers
        };

        await fetch(`http://localhost:3000/createGroupChat/${userID}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json', 
            },
            body: newGroupChat
        })
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">* Group name: </label>
                <input 
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)} 
                    required
                />

                <label htmlFor="members">Group members: </label>
                <select multiple onChange={handleMembersChange}>
                    {allUsers.map((user) => (
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

                <button type="submit">Create</button>
                <button onClick={onHide}>Cancel</button>
            </form>
        </div>
    )

}

export default NewGroupChat;