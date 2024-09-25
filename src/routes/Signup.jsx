import { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';  
import '../Signup.css';

function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log('username: ', username);
        console.log('password: ', password);

        try {
            const response = await fetch('http://localhost:3000/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                throw new Error('response not okay', response); 
            }
            const result = await response.json();
            console.log('signed up ', result);
            navigate('/login');
        } catch (err) {
            console.error('Error during signup', err);
            setErr(err.message);
        }
    }

    return (
        <div className="container">
        <form onSubmit={handleSubmit} className="form">
            <legend className="legend">Signup</legend>
            <label htmlFor="username" className="label">Username</label>
            <input
                type="text" 
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                onFocus={(e) => e.target.style.borderColor = '#f5a462'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <label htmlFor="password" className="label">Password</label>
            <input
                type="password" 
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                onFocus={(e) => e.target.style.borderColor = '#f5a462'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
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