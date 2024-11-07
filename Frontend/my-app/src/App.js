// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from '../src/pages/SignUpPage.jsx';
import LogInPage from './pages/LogInPage.jsx';
import HomePage from './pages/HomePage.jsx';
import VaccineAppointmentPage from './pages/VaccinationBookingPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PetParkAppointmentPage from './pages/PetParkBookingPage.jsx';
import GroomingAppointmentPage from './pages/GroomingBookingPage.jsx';
import SwimmingAppointmentPage from './pages/SwimmingBookingPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'daterangepicker/daterangepicker.css';
import 'jquery';
import 'moment';
import 'daterangepicker';
import EmployeeManagementPage from './pages/EmployeeManagePage.jsx';
import BookingManagementPage from './pages/BookingManagePage.jsx';
import FeedbackManagementPage from './pages/FeedbackManage.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
        

        <Route 
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/vaccine-booking" 
          element={
            <ProtectedRoute>
              <VaccineAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/vaccine-booking/:booking_id?" 
          element={
            <ProtectedRoute>
              <VaccineAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/petpark-booking" 
          element={
            <ProtectedRoute>
              <PetParkAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/petpark-booking/:booking_id?" 
          element={
            <ProtectedRoute>
              <PetParkAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/grooming-booking" 
          element={
            <ProtectedRoute>
              <GroomingAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/swimming-booking" 
          element={
            <ProtectedRoute>
              <SwimmingAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/swimming-booking/:booking_id?" 
          element={
            <ProtectedRoute>
              <SwimmingAppointmentPage />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/grooming-booking/:booking_id?" 
          element={
            <ProtectedRoute>
              <GroomingAppointmentPage />
            </ProtectedRoute>
          }
        />

<Route 
          path="/employee"
          element={
            <ProtectedRoute requiredRole="admin">
              <EmployeeManagementPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/booking"
          element={
            <ProtectedRoute requiredRole="admin">
              <BookingManagementPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/feedback"
          element={
            <ProtectedRoute requiredRole="admin">
              <FeedbackManagementPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;




