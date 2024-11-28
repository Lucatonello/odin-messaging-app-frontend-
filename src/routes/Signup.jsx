import { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';  
import '../Signup.css';

function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState("Hello World, this is my bio!");
    const [pfp, setPfp] = useState(null);
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('bio', bio);
        formData.append('pfp', pfp);

        try {
            const response = await fetch('https://odin-messaging-app-backend-production.up.railway.app/users/signup', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('response not okay', response.ok); 
            }
            const result = await response.json();
            console.log('signed up ', result);
            navigate('/login');
        } catch (err) {
            console.error('Error during signup', err);
            setErr(err.message);
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPfp(file);
    };

    return (
        <div className="container">
        <form onSubmit={handleSubmit} className="form">
            <legend className="legend">Signup</legend>
            <label htmlFor="username" className="label">* Username</label>
            <input
                type="text" 
                name="username"
                value={username}
                maxLength={15}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                onFocus={(e) => e.target.style.borderColor = '#f5a462'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <label htmlFor="password" className="label">* Password</label>
            <input
                type="password" 
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                onFocus={(e) => e.target.style.borderColor = '#f5a462'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <label htmlFor="bio" className="label">Bio</label>
            <input
                type="text" 
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input"
                onFocus={(e) => e.target.style.borderColor = '#f5a462'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <div className="file-upload-container">
                <label htmlFor="fileUpload" className="file-upload-btn">
                    Upload Profile Picture
                </label>
                <input
                    type="file"
                    name="pfp"
                    id="fileUpload"
                    onChange={handleFileChange}
                    accept=".png, .jpg, .jpeg"
                />
            </div>

            <button type="submit" className="button">Sign up</button>
        </form>
        <p className="paragraph">Already have an account?</p>
        <Link 
            to="/login" 
            className="link"
            onMouseOver={(e) => e.target.style.color = '#388E3C'}
            onMouseOut={(e) => e.target.style.color = '#f5a462'}
        >
            Login
        </Link>
        {err && <p className="errorMessage">{err}</p>}  
    </div>    
    );
}

export default Signup;