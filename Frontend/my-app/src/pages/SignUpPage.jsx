import React, { useState } from 'react';
import '../styles/SignUpPage.css';
import api from '../api.js';
import { useNavigate } from 'react-router-dom';
import Overlay from '../components/Overlay'; // Import the Overlay component

const SignUpPage = () => {
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [tel, setTel] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [petName, setPetName] = useState(''); 
  const [petType, setPetType] = useState(''); 
  const [petGender, setPetGender] = useState(''); 
  const [petWeight, setPetWeight] = useState(''); 
  const [healthConditionId, setHealthConditionId] = useState('');

  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const data = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
      tel: tel,
      name: petName,
      type: petType,
      gender: petGender,
      weight: petWeight,
      health_condition_id: healthConditionId,
    };

    try {
      const response = await api.post('/api/register', data);
      if (response.status === 201) {
        setShowSuccessOverlay(true);  // Show success overlay
        clearForm();
      } else {
        alert(response.data.error || 'An unknown error occurred');
      }
    } catch (error) {
      alert('Error occurred during sign-up: ' + error);
    }
  };

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setTel('');
    setPassword('');
    setConfirmPassword('');
    setPetName('');
    setPetType('');
    setPetGender('');
    setPetWeight('');
    setHealthConditionId('');
  };

  const handleOverlayClose = () => {
    setShowSuccessOverlay(false);
    navigate('/login'); // Redirect to login page after overlay is closed
  };

  return (
    <div className="signup-container">
      <h2 className="register-title">Register</h2>
      <div className="form-container">
        <form onSubmit={handleSignUp}>
          <div className="section-title">Owner Information</div>
          <div className="input-container">
            <label>First Name
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            <label>Last Name
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
            <label>Email
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>Phone
              <input
                type="tel"
                placeholder="Phone"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                required
              />
            </label>
            <label>Password
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label>Confirm Password
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="section-title">Pet Information</div>
          <div className="input-container">
            <label>Pet Name
              <input
                type="text"
                placeholder="Pet Name"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
              />
            </label>
            <label>Pet Type
              <input
                type="text"
                placeholder="Type"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                required
              />
            </label>
            <div className="radio-container-wrapper">
              <label>Pet Gender</label>
              <div className="radio-container">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={petGender === 'Female'}
                  onChange={() => setPetGender('Female')}
                />
                <label>Female</label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={petGender === 'Male'}
                  onChange={() => setPetGender('Male')}
                />
                <label>Male</label>
              </div>
            </div>

            <label>Weight
              <input
                type="text"
                placeholder="Weight"
                value={petWeight}
                onChange={(e) => setPetWeight(e.target.value)}
                required
              />
            </label>

            <label>Health Condition (optional)
              <select
                value={healthConditionId}
                onChange={(e) => setHealthConditionId(e.target.value)}
              >
                <option value="">Select Health Condition</option>
                <option value="1">Cancer</option>
                <option value="2">Diabetes</option>
                <option value="3">Kidney Disease</option>
                <option value="4">Heart Disease</option>
                <option value="5">Respiratory Infection</option>
                <option value="6">None</option>
              </select>
            </label>
          </div>

          <div className="button-wrapper">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>

      {showSuccessOverlay && (
        <Overlay 
          message="Account created successfully!" 
          onClose={handleOverlayClose} 
          show={showSuccessOverlay} 
        />
      )}
    </div>
  );
};

export default SignUpPage;
