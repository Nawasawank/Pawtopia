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


const route = Router();

route.put('/upload-photo',isAuth, upload.single('profileImage'), UpdatePhotoController.uploadProfileImage);

route.post('/register', SignUpController.register);
route.post('/login', LoginController.login);
route.get('/profile', isAuth, InfoController.getUserProfile);

route.post('/pet/add', isAuth, PetController.addPet);
route.delete('/pets/delete/:petId', isAuth, PetController.deletePet);
route.get('/pet/NameAndType',isAuth,PetController.getPetNamesAndTypes);

route.post('/booking/Hotel',isAuth,HotelController.addHotelBooking);
route.post('/booking/Vaccine',isAuth,VaccineController.addBooking);

export default route;
