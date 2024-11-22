import { Router } from 'express';
import SignUpController from '../controllers/SignUp.controller.js';
import LoginController from '../controllers/LogIn.controller.js';
import UpdatePhotoController from '../controllers/UpdatePhoto.controller.js';
import InfoController from '../controllers/Info.controller.js';
import { isAuth } from '../utils/Auth.js';
import upload from '../utils/MulterConfig.js'; 
import PetController from '../controllers/Pet.Controller.js';
import HistoryController from '../controllers/History.controller.js';
import FeedbackController from '../controllers/Feedback.controller.js';
import AdminController from '../controllers/Admin.controller.js';
import EmployeeController from '../controllers/Employee.controller.js';
import bookingsController from '../controllers/Booking.controller.js';
import IssuesController from '../controllers/Issues.controller.js';
import DeveloperController from '../controllers/Developer.controller.js';


const route = Router();

//admin name for navbar
route.get('/admin_name', isAuth, InfoController.getAdminProfile);
route.post('/register', SignUpController.register);
route.post('/login', LoginController.login);

route.get('/dev/issues',isAuth,IssuesController.getIssues)
route.put('/dev/issues/update',isAuth,IssuesController.updateIssueStatus)

//feedback of each service
route.get('/getfeedback/:service_id',FeedbackController.getFeedback);

//Change Profile Picture
route.put('/upload-photo',isAuth, upload.single('profileImage'), UpdatePhotoController.uploadProfileImage);

//Get user name and picture for navbar
route.get('/profile', isAuth, InfoController.getUserProfile);
//Get developer name for navbar
route.get('/dev_name', isAuth, InfoController.getDeveloperProfile);

//Get all user information
route.get('/info', isAuth, InfoController.getUserInfo);
//update user info
route.put('/update/info',isAuth,InfoController.updateUserInfo)
//update pet
route.put('/update/pet/:petId',isAuth,InfoController.updatePetInfo)
route.delete('/deleteUserAndPets/:userId',isAuth,InfoController.deleteUserAndPets)

//Get all user and pet count 
route.get('/allUsers',isAuth, InfoController.getUserInfoAndPetCount);

//add pet, delete pet, get pet name and type
route.post('/pet/add', isAuth, PetController.addPet); 
route.delete('/pets/delete/:petId', isAuth, PetController.deletePet);
route.get('/pet/NameAndType',isAuth,PetController.getPetNamesAndTypes);
route.get('/pet/AllPet/:userId',isAuth,PetController.getPetByUserId);

//Add,Delete,Update Booking
route.post('/:service_id/book',isAuth, bookingsController.addBooking);
route.delete('/:service_id/:booking_id', isAuth, bookingsController.deleteBooking);
route.get('/:service_id/:booking_id',isAuth, bookingsController.getBookingsByDate);
route.get('/bookings/:service_id/:booking_id',isAuth, bookingsController.getBookingById);
route.put('/update/:service_id/:booking_id',isAuth, bookingsController.updateBooking);

//Get History
route.get('/history',isAuth,HistoryController.getAppointmentHistory);

//Add Feedback
route.post('/feedback',isAuth,FeedbackController.createFeedback);


//Admin
route.post('/admin/register',AdminController.AdminSignUp);

//Dev
route.post('/dev/register',DeveloperController.DeveloperSignUp);

//Get Employee in each service
route.get('/employees/service/:serviceId',isAuth, EmployeeController.getEmployeesByService);
//update employee
route.put('/employees/update/:employeeId',isAuth, EmployeeController.updateEmployee);
//add employee
route.post('/employees',isAuth, EmployeeController.addEmployee);
//delete employee
route.delete('/delete/employees/:employeeId',isAuth, EmployeeController.deleteEmployee);

//get boooking by date
route.get('/bookings/by-date',isAuth, bookingsController.getBookingsByDate);

//get feed back
route.get('/feedback',isAuth, FeedbackController.getFeedbackByTypeAndDate);

//Add TechnicalFeedback
route.post('/user/issues', isAuth, FeedbackController.createTechnicalFeedback);

route.post('/admin/issues',isAuth,IssuesController.createIssue);


export default route;
