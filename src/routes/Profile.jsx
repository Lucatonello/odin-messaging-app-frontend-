import { useState, useEffect } from "react";
import '../Profile.css';

function Profile({ contactid, admin }) {
    const [editMode, setEditMode] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newBio, setNewBio] = useState("");
    const [data, setData] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`http://localhost:3000/profiles/${contactid}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json',
            }
        })
          .then(res => res.json())
          .then(data => {
            setData(data[0]);
          })
          .catch(err => console.error(err));
    }, [token, contactid]);

    const handleUserNameChange = async () => {
        if (admin) {
            setEditMode(false);

            setData((prevData) => ({
              ...prevData,
              username: newUsername,
            }));
    
            await fetch(`http://localhost:3000/editData/${contactid}`, {
                 method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ type: 'username', newData: newUsername })
            })
    
        }
      };
      const handleBioChange = async () => {
        if (admin) {
            setEditMode(false);

            setData((prevData) => ({
              ...prevData,
              bio: newBio,
            }));
    
            await fetch(`http://localhost:3000/editData/${contactid}`, {
                 method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ type: 'bio', newUsername: newUsername })
            })
        }
      };
    

    return (
        <div className="profile-sidebar">
            {data.profilepic ? (
                <img src={data.profilepic} alt="Profile Picture" />
            ) : (
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                    alt="Default Profile Picture"
                />
            )}
            {admin && <button>Edit profile picture</button>}
            
            <div className="profile-details">
                {editMode ? (
                    <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Enter new username"
                            />
                        ) : (
                            <h1>{data.username}</h1>
                        )}

                        {admin && !editMode && (
                            <button onClick={() => {
                            setEditMode(true);
                            setNewUsername(data.username); // Set the initial value to the current username
                            }}>
                            Change username
                            </button>
                        )}

                        {editMode && (
                            <button onClick={handleUserNameChange}>Save</button>
                        )}
            </div>
            <div className="profile-details">
                {editMode ? (
                    <input
                            type="text"
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            placeholder="Enter new bio"
                            />
                        ) : (
                            <h1>{data.bio}</h1>
                        )}

                        {admin && !editMode && (
                            <button onClick={() => {
                            setEditMode(true);
                            setNewBio(data.bio); // Set the initial value to the current username
                            }}>
                            Change bio
                            </button>
                        )}

                        {editMode && (
                            <button onClick={handleBioChange}>Save</button>
                        )}
            </div>

            <div className="profile-details">
                <p>Bio: {data.bio}</p> {admin && <button>Change bio</button>}
                <p>Number: {data.number}</p> {admin && <button>Change bio</button>}
            </div>
        </div>
    );
}

export default Profile;
