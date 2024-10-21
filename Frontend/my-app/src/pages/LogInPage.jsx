import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LogInPage.css';
import useLocalStorage from '../hooks/useLocalStorage';

const LogInPage = () => {
    const [email, setEmail] = useLocalStorage('email', '');
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            email,
            password,
        };

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData), 
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                alert('Login successful!');
                console.log('Token:', data.token);
                navigate('/home');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError('An error occurred during login. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Log In</h2>
                <form onSubmit={handleLogin}>
                    <div className="login-input-container">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                    </div>
                    <div className="login-input-container">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-btn">Submit</button>
                </form>
                <div className="signup-link">
                    <p><a href="/signup">Don't have an account? </a></p>
                </div>
            </div>
        </div>
    );
};

export default LogInPage;
