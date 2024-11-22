import React, { useState, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../styles/LogInPage.css';
import useLocalStorage from '../hooks/useLocalStorage';
import api from '../api'; 
import Overlay from '../components/Overlay';

const LogInPage = () => {
    const [email, setEmail] = useLocalStorage('email', '');
    const [password, setPassword] = useState(''); 
    const [overlayMessage, setOverlayMessage] = useState(''); 
    const [showOverlay, setShowOverlay] = useState(false); 
    const navigate = useNavigate();
    const emailRef = useRef(null); // Reference to the email input field

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
                if (role === 'admin') {
                    navigate('/AdminHome');
                }
                else if(role === 'developer'){
                    navigate('/DevHome');
                } else {
                    navigate('/home'); // Navigate to home to refresh with new state
                }
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                if (errorMessage === 'Email not found' || errorMessage === 'Invalid Password') {
                    setOverlayMessage(errorMessage); 
                } else {
                    setOverlayMessage('An error occurred during login. Please try again.');
                }
            } else {
                setOverlayMessage('An error occurred during login. Please try again.');
            }
            setShowOverlay(true); 
        }
    };

    const closeOverlay = () => {
        setShowOverlay(false);
        setEmail(''); // Reset email to initial state
        setPassword(''); // Reset password to initial state
        if (emailRef.current) {
            emailRef.current.focus(); // Return focus to the email field
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
                            ref={emailRef} // Set the reference for email input
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
                    <button type="submit" className="login-btn">Submit</button>
                </form>
                <div className="signup-link">
                    <p><a href="/signup">Don't have an account? </a></p>
                </div>
            </div>

            {/* Render the Overlay component only if showOverlay is true */}
            {showOverlay && (
                <Overlay 
                    message={overlayMessage} 
                    onClose={closeOverlay} // Call closeOverlay to close overlay and refocus
                />
            )}
        </div>
    );
};

export default LogInPage;
