import { useState, useEffect } from "react";
import arrow from '../img/back-arrow.png';
import defaultPfp from '../img/user.png';
import styles from '../Profile.module.css';

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
        <div className={styles.profileSidebar}>
            {data.profilepic ? (
                <img src={data.profilepic} alt="Profile Picture" className={styles.pfp} />
            ) : (
                <img
                    src={defaultPfp}
                    alt="Default Profile Picture"
                    className={styles.pfp}
                />
            )}
            
            <div className={styles.profileDetails}>
                {editUsername ? (
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter new username"
                        className={styles.newInput}
                    />
                ) : (
                    <h1 className={styles.username}>{data.username}</h1>
                )}

                {admin && !editUsername && (
                    <button
                        onClick={() => {
                            setEditUsername(true);
                            setNewUsername(data.username); // Set the initial value to the current username
                        }}
                        className={styles.editButtons}
                    >
                        Change username
                    </button>
                )}

                {editUsername && (
                    <div>
                        <button className={styles.editButtons} style={{ marginRight: '5px' }} onClick={handleUserNameChange}>
                            Save
                        </button>
                        <button className={styles.editButtons} onClick={() => setEditUsername(false)}>Cancel</button>
                    </div>
                )}
            </div>

            <div className={styles.profileDetails}>
                {editBio ? (
                    <input
                        type="text"
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        placeholder="Enter new bio"
                        className={styles.newInput}
                    />
                ) : (
                    <div className={data.bio ? styles.bio : ''}>
                        <p>{data.bio}</p>
                    </div>
                )}

                {admin && !editBio && (
                    <button
                        onClick={() => {
                            setEditBio(true);
                            setNewBio(data.bio);
                        }}
                        className={styles.editButtons}
                    >
                        Change bio
                    </button>
                )}

                {editBio && (
                    <div>
                        <button className={styles.editButtons} style={{ marginRight: '5px' }} onClick={handleBioChange}>
                            Save
                        </button>
                        <button className={styles.editButtons} onClick={() => setEditBio(false)}>Cancel</button>
                    </div>
                )}
            </div>

            <button onClick={onHide} className={styles.hideButton}>
                <img src={arrow} alt="<-" style={{ height: '35px', width: '35px' }} />
            </button>
        </div>
    );
}

export default Profile;
