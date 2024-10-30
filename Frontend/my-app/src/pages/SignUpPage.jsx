import React from 'react';
import '../styles/SignUpPage.css';
import useLocalStorage from '../hooks/useLocalStorage';
import api from '../api.js'

const SignUpPage = () => {
  const [firstName, setFirstName] = useLocalStorage('firstName', ''); 
  const [lastName, setLastName] = useLocalStorage('lastName', ''); 
  const [email, setEmail] = useLocalStorage('email', ''); 
  const [tel, setTel] = useLocalStorage('tel', ''); 
  const [password, setPassword] = useLocalStorage('password', ''); 
  const [confirmPassword, setConfirmPassword] = useLocalStorage('confirmPassword', ''); 

  // Pet Information
  const [petName, setPetName] = useLocalStorage('petName', ''); 
  const [petType, setPetType] = useLocalStorage('petType', ''); 
  const [petGender, setPetGender] = useLocalStorage('petGender', ''); 
  const [petWeight, setPetWeight] = useLocalStorage('petWeight', ''); 
  const [vaccination, setVaccination] = useLocalStorage('vaccination', ''); 
  const [healthCondition, setHealthCondition] = useLocalStorage('healthCondition', '');

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
      vaccination: vaccination,
      health_condition: healthCondition,
    };

    try {
      const response = await api.post('/api/register', data);
      if (response.status === 201) {
        alert('Sign up successful!');
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
    setVaccination('');
    setHealthCondition('');
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
              <label>Vaccination
                <input
                  type="text"
                  placeholder="Vaccination"
                  value={vaccination}
                  onChange={(e) => setVaccination(e.target.value)}
                  required
                />
              </label>
              <label>Health Condition (optional)
                <input
                  type="text"
                  placeholder="Health Condition"
                  value={healthCondition}
                  onChange={(e) => setHealthCondition(e.target.value)}
                />
              </label>
            </div>

            <div className="button-wrapper">
              <button type="submit">Submit</button>
            </div>

          </form>
        </div>
      </div>
  );
};

export default SignUpPage;
