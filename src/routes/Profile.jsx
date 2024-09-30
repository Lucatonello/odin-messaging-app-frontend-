import { useState, useEffect } from "react";
import arrow from '../img/back-arrow.png';
import '../Profile.css';

function Profile({ contactid, admin, onHide }) {
    const [editUsername, setEditUsername] = useState(false);
    const [editBio, setEditBio] = useState(false);

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
            setEditUsername(false);

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
            setEditBio(false);

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
                body: JSON.stringify({ type: 'bio', newData: newBio })
            })
        }
      };
    

    return (
        <div className="profile-sidebar">
            {data.profilepic ? (
                <img src={data.profilepic} alt="Profile Picture" className="pfp" />
            ) : (
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                    alt="Default Profile Picture"
                    className="pfp"
                />
            )}
            
            <div className="profile-details">
                {editUsername ? (
                    <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Enter new username"
                            />
                        ) : (
                            <h1>{data.username}</h1>
                        )}

                        {admin && !editUsername && (
                            <button onClick={() => {
                            setEditUsername(true);
                            setNewUsername(data.username); // Set the initial value to the current username
                            }}>
                            Change username
                            </button>
                        )}

                        {editUsername && (
                            <div>
                                <button style={{ marginRight: '5px'}} onClick={handleUserNameChange}>Save</button>
                                <button onClick={() => setEditUsername(false)}>Cancel</button>
                            </div>    
                        )}
            </div>
            <div className="profile-details">
                {editBio ? (
                    <input
                            type="text"
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            placeholder="Enter new bio"
                            />
                        ) : (
                            <div className={data.bio ? 'bio' : ''}> 
                                <p>{data.bio}</p>
                            </div>
                        )}

                        {admin && !editBio && (
                            <button onClick={() => {
                            setEditBio(true);
                            setNewBio(data.bio); 
                            }}>
                            Change bio
                            </button>
                        )}

                        {editBio && (
                            <div>
                                <button style={{ marginRight: '5px'}} onClick={handleBioChange}>Save</button>
                                <button onClick={() => setEditBio(false)}>Cancel</button>
                            </div>
                        )}
            </div>
            <button onClick={onHide} className="hideButton">
                <img src={arrow} alt="<-" style={{ height: '35px', width: '35px'}} />
            </button>
        </div>
    );
}

export default Profile;
