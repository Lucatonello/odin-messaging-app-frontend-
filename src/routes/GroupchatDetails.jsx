import { useState, useEffect } from 'react'
import styles from '../GroupchatDetails.module.css';
import arrow from '../img/back-arrow.png'
import cross from '../img/cross.png';
import Profile from './Profile';

// eslint-disable-next-line react/prop-types
function GroupchatDetails({ onHide, groupId }) {
    const [groupMetadata, setGroupMetadata] = useState(null)
    const [showProfile, setShowProfile] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(true);

    //edit states for the admin
    const [editGroupName, setEditGroupName] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [editDescription, setEditDescription] = useState(false);
    const [newDescription, setNewDescription] = useState("");

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    useEffect(() => {
        setLoading(true);
        fetch(`https://odin-messaging-app-backend-production.up.railway.app/groupChatInfo/${groupId}`, {
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
        const handleGroupNameChange = async () => {
            setEditGroupName(false);

            setGroupMetadata((prevData) => {
                return prevData.map((group) => {
                    if (group.id === groupMetadata[0].id) {
                        return { ...group, name: newGroupName };
                    }
                    return group;
                });
            });
            await fetch(`https://odin-messaging-app-backend-production.up.railway.app/editGroupData/${groupMetadata[0].id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ type: 'name', newData: newGroupName })
            }) 
        };
        const handleDescriptionChange = async () => {
            setEditDescription(false);

            setGroupMetadata((prevData) => {
                return prevData.map((group) => {
                    if (group.id === groupMetadata[0].id) {
                        return { ...group, description: newDescription };
                    }
                    return group;
                });
            });

            await fetch(`https://odin-messaging-app-backend-production.up.railway.app/editGroupData/${groupMetadata[0].id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ type: 'description', newData: newDescription })
            }) 
        };

    const handleDeleteMember = async (member) => {
        await fetch(`https://odin-messaging-app-backend-production.up.railway.app/deleteGroupMember/${groupId}/${member}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ member })

        })
          .then(() => window.location.reload())
    };
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
        
            </div>

            {/*Name*/}
            <div className={styles.profileDetails}>
                {editGroupName ? (
                    <input
                        type="text"
                        value={newGroupName}
                        maxLength={40}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className={styles.editInput}
                    />
                    ) : (
                    <h1 className={styles.username}>{groupMetadata[0]?.name || 'No name'}</h1>
                )}
                {groupMetadata[0].admin === username && (
                    <button
                        onClick={() => {
                            setEditGroupName(true);
                            setNewGroupName(groupMetadata[0].name);
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
                )}
            </div>

            {/*Description*/}
            <div className={styles.description}>
                <div className={groupMetadata[0]?.description ? styles.description : ''}>
                    {editDescription ? (
                    <input
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className={styles.description} 
                    />
                    ) : (
                    <p>{groupMetadata[0]?.description || 'No description'}</p>
                    )}
                </div>
            </div>

            {groupMetadata[0].admin === username && (
                <button
                    onClick={() => {
                    setEditDescription(true);
                    setNewDescription(groupMetadata[0].description || '');
                    }}
                    className={styles.editButtons}
                >
                    Change description
                </button>
                )}

                {editDescription && (
                <div>
                    <button
                    className={styles.editButtons}
                    style={{ marginRight: '5px' }}
                    onClick={handleDescriptionChange}
                    >
                    Save
                    </button>
                    <button className={styles.editButtons} onClick={() => setEditDescription(false)}>
                    Cancel
                    </button>
                </div>
            )}

            {/*Members*/}
            <div className={styles.profileDetails}>
                <h2>Members</h2>
                <ul className={styles.memberList}>
                    {groupMetadata[0].members.length > 0 ? (
                        groupMetadata[0].members.map((member, index) => (
                            <li key={index} className={styles.memberItem}>
                                <img
                                    src={groupMetadata[0].profilepics[index]}
                                    alt="pfp"
                                    className={styles.memberPic}
                                    style={{ height: '35px', width: '35px', marginRight: '10px', borderRadius: '50%', cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelectedContact(groupMetadata[0].ids[index])
                                        setShowProfile(true)
                                    }} 
                                />
                                {groupMetadata[0].admin == member ? member + ' - admin' : (
                                    groupMetadata[0].admin == username ? (
                                        <div style={{ display: 'flex' }}>
                                        {member}
                                        <img 
                                            src={cross} 
                                            alt="x" 
                                            style={{ height: '20px', width: '20px', cursor: 'pointer', margin: '0px 0px 0px 7px' }}
                                            onClick={() => handleDeleteMember(member)}
                                        />
                                    </div>
                                    ) : member
                                )}
                            </li>
                        ))
                    ) : (
                        <li>No members available</li>
                    )}
                </ul>
            </div>

            <button onClick={onHide} className={styles.hideButton}>
                <img src={arrow} alt="<-" style={{ height: '35px', width: '35px' }} />
            </button>

            {showProfile && <Profile contactid={selectedContact} admin={false} onHide={() => setShowProfile(false)} />}
        </div>

    )
}

export default GroupchatDetails;