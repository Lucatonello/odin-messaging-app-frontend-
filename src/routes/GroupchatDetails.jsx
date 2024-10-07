import { useState, useEffect } from 'react'
import styles from '../Chat.module.css';
import arrow from '../img/back-arrow.png'
function GroupchatDetails({ onHide, groupId }) {
    const [groupMetadata, setGroupMetadata] = useState(null)
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/groupChatInfo/${groupId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            }
        })
          .then(res => res.json())
          .then(data => {
            console.log('groupMetadata: ', data)
            setGroupMetadata(data)
            setLoading(false);  
          })
          .catch(error => {
            console.error('Error fetching group metadata:', error);
            setLoading(false);
          });
    }, [groupId, token])

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!groupMetadata) {
        return <div>Error loading group data</div>;
    }
    
    return (
        <div className={styles.profileSidebar}>
            <div className={styles.imgContainer}>
                {groupMetadata && groupMetadata.profilepics && Array.isArray(groupMetadata.profilepics) && 
                    groupMetadata.profilepics.map((pic, index) => (
                            <img
                                key={index}
                                src={pic}
                                alt="Group Profile Picture"
                                className={styles.pfp}
                                style={{ height: '35px', width: '35px', marginRight: '10px', borderRadius: '50%' }}
                            />
                    ))
                }
                
                {/* Commented out the form for changing profile pics */}
                {/* {admin === currentUser && (
                    <form onSubmit={handleNewPfpSubmit}>
                        <input 
                            type="file" 
                            name="newPfp"
                            className="newPfpSelector"
                            onChange={handlePfpChange}
                        />
                        {newPfp && (
                            <button type="submit">Change</button>
                        )}
                    </form>
                )} */}
            </div>

            <div className={styles.profileDetails}>
            <h1 className={styles.username}>{groupMetadata[0]?.name || 'No name'}</h1>

                {/* Commented out the option to change the group chat name */}
                {/* {admin === currentUser && !editGroupName && (
                    <button
                        onClick={() => {
                            setEditGroupName(true);
                            setNewGroupName(groupMetadata.name);
                        }}
                        className={styles.editButtons}
                    >
                        Change group name
                    </button>
                )}
                {editGroupName && (
                    <div>
                        <button className={styles.editButtons} style={{ marginRight: '5px' }} onClick={handleGroupNameChange}>
                            Save
                        </button>
                        <button className={styles.editButtons} onClick={() => setEditGroupName(false)}>Cancel</button>
                    </div>
                )} */}
            </div>

            <div className={styles.profileDetails}>
            <div className={groupMetadata?.description ? styles.bio : ''}>
                <p>{groupMetadata[0]?.description || 'No description'}</p>
            </div>

                {/* Commented out the option to change group description */}
                {/* {admin === currentUser && !editDescription && (
                    <button
                        onClick={() => {
                            setEditDescription(true);
                            setNewDescription(groupMetadata.description);
                        }}
                        className={styles.editButtons}
                    >
                        Change description
                    </button>
                )}
                {editDescription && (
                    <div>
                        <button className={styles.editButtons} style={{ marginRight: '5px' }} onClick={handleDescriptionChange}>
                            Save
                        </button>
                        <button className={styles.editButtons} onClick={() => setEditDescription(false)}>Cancel</button>
                    </div>
                )} */}
            </div>

            <div className={styles.profileDetails}>
                <h2>Members</h2>
                <ul className={styles.memberList}>
                    {groupMetadata[0].members.length > 0 ? (
                        groupMetadata[0].members.map((member, index) => (
                            <li key={index}>{member}</li>
                        ))
                    ) : (
                        <li>No members available</li>
                    )}
                </ul>
            </div>

            <button onClick={onHide} className={styles.hideButton}>
                <img src={arrow} alt="<-" style={{ height: '35px', width: '35px' }} />
            </button>
        </div>

    )
}

export default GroupchatDetails;