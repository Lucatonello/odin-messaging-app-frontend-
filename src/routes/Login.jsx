/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('https://odin-messaging-app-backend-production.up.railway.app/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                console.log('Logged in successfully -');
                navigate('/');
            } else {
                console.error('Login failed:', data);
                setErr(data || 'Login failed');
            }
        } catch (err) {
            console.error('Error during login:', err);
            setErr(err.message);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="form">
                <legend className="legend">Login</legend>
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
                <button type="submit" className="button">Log in</button>
                {err && <p className="errorMessage">{err}</p>}
            </form>
            <p className="paragraph">Don't have an account?</p>
            <Link
                to="/signup"
                className="link"
                onMouseOver={(e) => e.target.style.color = '#388E3C'}
                onMouseOut={(e) => e.target.style.color = '#f5a462'}
            >
                Signup
            </Link>
        </div>
    );
}

export default Login;
