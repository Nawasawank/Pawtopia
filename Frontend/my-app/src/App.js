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
import VaccinationInfoPage from './pages/VaccinationInfoPage.jsx';
import GroomingInfoPage from './pages/GroomingInfoPage.jsx';
import SwimmingInfoPage from './pages/SwimmingInfoPage.jsx';
import PetParkInfoPage from './pages/PetParkInfoPage.jsx';
import AdminHomePage from './pages/AdminHomePage.jsx';
import AdminSignUpPage from './pages/AdminSignUpPage.jsx'
import FeedbackManagementPage from './pages/FeedbackManage.jsx'
import AdminReportIssue from './pages/AdminReportIssue.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AboutUsPage from './pages/AboutUsPage.jsx';
import ProfilePage from './pages/UserProfilePage.jsx';
import DeveloperSignUpPage from './pages/DeveloperSignUpPage.jsx';
import IssuesPage from './pages/DeveloperHomePage.jsx';
import ClientManagementPage from './pages/ClientManagePage.jsx';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path='/signup/admin' element={<AdminSignUpPage />} />
        <Route path='/signup/dev' element={<DeveloperSignUpPage />} />
        <Route path="/" element={<HomePage/>} />
        <Route 
          path="/home"
          element={
              <HomePage />
          }
        />
        <Route 
          path="/vaccine-booking" 
          element={
            <ProtectedRoute requiredRole="user">
              <VaccineAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/vaccine-booking/:booking_id?" 
          element={
            <ProtectedRoute requiredRole="user">
              <VaccineAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/petpark-booking" 
          element={
            <ProtectedRoute requiredRole="user">
              <PetParkAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/petpark-booking/:booking_id?" 
          element={
            <ProtectedRoute requiredRole="user"> 
              <PetParkAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/grooming-booking" 
          element={
            <ProtectedRoute requiredRole="user">
              <GroomingAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/swimming-booking" 
          element={
            <ProtectedRoute requiredRole="user">
              <SwimmingAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/swimming-booking/:booking_id?" 
          element={
            <ProtectedRoute requiredRole="user">
              <SwimmingAppointmentPage />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/history" 
          element={
            <ProtectedRoute requiredRole="user">
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/grooming-booking/:booking_id?" 
          element={
            <ProtectedRoute requiredRole="user">
              <GroomingAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/contact" 
          element={
            <ProtectedRoute requiredRole="user">
              <ContactPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requiredRole="user">
              <ProfilePage />
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
          path="/client"
          element={
            <ProtectedRoute requiredRole="admin">
              <ClientManagementPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/AdminHome"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminHomePage />
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

        <Route 
          path="/issue"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminReportIssue />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/DevHome"
          element={
            <ProtectedRoute requiredRole="developer">
              <IssuesPage />
            </ProtectedRoute>
          }
        />

         <Route 
          path="/swimming"
          element={

              <SwimmingInfoPage />
          }
        />
        <Route 
          path="/vaccine"
          element={
              <VaccinationInfoPage />
          }
        />
        <Route 
          path="/grooming"
          element={
              <GroomingInfoPage />
          }
        />
        <Route 
          path="/petpark"
          element={
              <PetParkInfoPage />
          }
        /> 

        <Route 
          path="/aboutus"
          element={
              <AboutUsPage />
          }
        /> 


        <Route path="/" element={<LogInPage />} />
      </Routes>
    </Router>
  );
}

export default App;