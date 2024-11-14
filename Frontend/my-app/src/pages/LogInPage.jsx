import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LogInPage.css';
import useLocalStorage from '../hooks/useLocalStorage';
import api from '../api'; 

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
            const response = await api.post('/api/login', loginData);
            if (response.status === 200) {
                const { token, role } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);  
                alert('Login successful!');
                console.log('Token:', token);
                console.log('Role:', role);
                if (role === 'admin') {
                    navigate('/AdminHome');
                } else if (role === 'developer') {
                    navigate('/developer-dashboard');
                } else {
                    navigate('/home');  
                }
            } else {
                setError(response.data.error || 'Login failed');
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
