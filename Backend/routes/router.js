import { Router } from 'express';
import SignUpController from '../controllers/SignUp.controller.js';
import LoginController from '../controllers/LogIn.controller.js';
import UpdatePhotoController from '../controllers/UpdatePhoto.controller.js';
import InfoController from '../controllers/Info.controller.js';
import { isAuth } from '../utils/Auth.js';
import upload from '../utils/MulterConfig.js'; 
import PetController from '../controllers/Pet.Controller.js';
import VaccineController from '../controllers/Vaccine.controller.js';
import SwimmingController from '../controllers/Swimming.controller.js';
import GroomingController from '../controllers/Grooming.controller.js';
import PetParkController from '../controllers/PetPArk.controller.js';
import HistoryController from '../controllers/History.controller.js';
import FeedbackController from '../controllers/Feedback.controller.js';
import AdminController from '../controllers/Admin.controller.js';


const route = Router();

route.post('/register', SignUpController.register);
route.post('/login', LoginController.login);

//Change Profile Picture
route.put('/upload-photo',isAuth, upload.single('profileImage'), UpdatePhotoController.uploadProfileImage);

//Get user name and picture for navbar
route.get('/profile', isAuth, InfoController.getUserProfile);

//add pet, delete pet, get pet name and type
route.post('/pet/add', isAuth, PetController.addPet); 
route.delete('/pets/delete/:petId', isAuth, PetController.deletePet);
route.get('/pet/NameAndType',isAuth,PetController.getPetNamesAndTypes);

//Booking
route.post('/booking/Vaccine',isAuth,VaccineController.addBooking);
route.post('/booking/Swimming',isAuth,SwimmingController.addBooking);
route.post('/booking/Grooming',isAuth,GroomingController.addBooking);
route.post('/booking/PetPark',isAuth,PetParkController.addBooking);


//Get info of each booking
route.get('/booking/Grooming/:booking_id',isAuth,GroomingController.getBookingById);
route.get('/booking/PetPark/:booking_id',isAuth,PetParkController.getBookingById);
route.get('/booking/Swimming/:booking_id',isAuth,SwimmingController.getBookingById);
route.get('/booking/Vaccination/:booking_id',isAuth,VaccineController.getBookingById);

//Get History
route.get('/history',isAuth,HistoryController.getAppointmentHistory);

//Add Fedback
route.post('/feedback',isAuth,FeedbackController.createFeedback);

//update Booking
route.patch('/update-booking/grooming/:booking_id',isAuth,GroomingController.updateBooking);
route.patch('/update-booking/petpark/:booking_id',isAuth,PetParkController.updateBooking);
route.patch('/update-booking/swimming/:booking_id',isAuth,SwimmingController.updateBooking);
route.patch('/update-booking/vaccination/:booking_id',isAuth,VaccineController.updateBooking);

//delete booking
route.delete('/delete-booking/grooming/:booking_id',isAuth,GroomingController.deleteBooking);
route.delete('/delete-booking/petpark/:booking_id',isAuth,PetParkController.deleteBooking);
route.delete('/delete-booking/swimming/:booking_id',isAuth,SwimmingController.deleteBooking);
route.delete('/delete-booking/vaccination/:booking_id',isAuth,VaccineController.deleteBooking);

//Admin
route.post('/admin/register',AdminController.AdminSignUp);
route.post('/admin/login',AdminController.AdminLogIn)

export default route;
