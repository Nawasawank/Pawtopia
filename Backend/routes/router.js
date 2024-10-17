import { Router } from 'express';
import { register } from '../controllers/SignUp.controller.js';
import { login } from '../controllers/LogIn.controller.js';
import { uploadProfileImage } from '../controllers/UpdatePhoto.controller.js';
import { getUserProfile } from '../controllers/Info.controller.js';
import { isAuth } from '../utils/Auth.js';
import upload from '../utils/MulterConfig.js'; 
import { addPetController, deletePetController,getPetNamesAndTypesController } from '../controllers/Pet.Controller.js';
import { addHotelBookingController, deleteHotelBookingController, getHotelBookingByIdController } from '../controllers/Hotel.controller.js';


const route = Router();

route.post('/upload-photo', upload.single('profileImage'), uploadProfileImage);

route.post('/register', register);
route.post('/login', login);
route.get('/profile', isAuth, getUserProfile);

route.post('/pet/add', isAuth, addPetController);
route.delete('/pets/delete/:petId', isAuth, deletePetController);
route.get('/pet/NameAndType',isAuth,getPetNamesAndTypesController);

route.post('/booking/Hotel',isAuth,addHotelBookingController);

export default route;
