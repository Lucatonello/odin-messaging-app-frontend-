import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../Profile.css';

function Profile({ contactid }) {
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState(null);
    const { id } = useParams();
    const token = localStorage.getItem('token');

    console.log('contact id in profile module: ', contactid);

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
        }
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

            <div className="profile-details">
                <h1>{data.username}</h1>
                {userId === id && (
                    <div className="edit-buttons">
                        <button>Edit Profile</button>
                    </div>
                )}
            </div>

            <div className="profile-details">
                <p>Bio: {data.bio}</p>
                {userId === id && <button>Edit Bio</button>}
                <p>Number: {data.number}</p>
                {userId === id && <button>Edit Number</button>}
            </div>
        </div>
    );
}

export default Profile;
