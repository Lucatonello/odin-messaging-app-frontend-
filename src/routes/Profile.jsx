import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

function Profile() {
    const [data, setData] = useState([]);
    const { id } = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`http://localhost:3000/profiles/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json',
            }
        })
          .then(res=> res.json())
          .then(data => {
            setData(data[0]);
          })
          .catch(err => console.error(err));
    }, [token, id]);

    console.log('data state:', data);

    return (
        <div>
            {data.profilepic ? (
                <img src={data.profilepic} alt={'../images/defaultpp'} />

            ): <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" alt='pfp' />}
            <h1>{data.username}</h1>
            <button>Text</button>
            <div>
                <p>Bio: {data.bio}</p>
                <p>Number: {data.number}</p>
            </div>
        </div>
    )
}

export default Profile;