import { Router } from 'express';
import SignUpController from '../controllers/SignUp.controller.js';
import LoginController from '../controllers/LogIn.controller.js';
import UpdatePhotoController from '../controllers/UpdatePhoto.controller.js';
import InfoController from '../controllers/Info.controller.js';
import { isAuth } from '../utils/Auth.js';
import upload from '../utils/MulterConfig.js'; 
import PetController from '../controllers/Pet.Controller.js';
import HotelController from '../controllers/Hotel.controller.js';
import VaccineController from '../controllers/Vaccine.controller.js';
import SwimmingController from '../controllers/Swimming.controller.js';
import GroomingController from '../controllers/Grooming.controller.js';
import PetParkController from '../controllers/PetPArk.controller.js';


const route = Router();

//Change Profile Picture
route.put('/upload-photo',isAuth, upload.single('profileImage'), UpdatePhotoController.uploadProfileImage);

route.post('/register', SignUpController.register);
route.post('/login', LoginController.login);

//Get user name and picture for navbar
route.get('/profile', isAuth, InfoController.getUserProfile);

//add pet, delete pet, get pet name and type
route.post('/pet/add', isAuth, PetController.addPet); 
route.delete('/pets/delete/:petId', isAuth, PetController.deletePet);
route.get('/pet/NameAndType',isAuth,PetController.getPetNamesAndTypes);

//Booking
route.post('/booking/Hotel',isAuth,HotelController.addHotelBooking);
route.post('/booking/Vaccine',isAuth,VaccineController.addBooking);
route.post('/booking/Swimming',isAuth,SwimmingController.addBooking);
route.post('/booking/Grooming',isAuth,GroomingController.addBooking);
route.post('/booking/PetPark',isAuth,PetParkController.addBooking);


export default route;
