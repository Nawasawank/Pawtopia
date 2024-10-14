import { Router } from 'express';
import { register } from '../controllers/SignUp.controller.js';
import { login } from '../controllers/LogIn.controller.js';
import { uploadProfileImage } from '../controllers/UpdatePhoto.controller.js';
import { getUserProfile } from '../controllers/Info.controller.js';
import { isAuth } from '../utils/Auth.js';
import upload from '../utils/MulterConfig.js';  // Import multer configuration

const route = Router();

// New route for profile image upload
route.post('/upload-photo', upload.single('profileImage'), uploadProfileImage);

route.post('/register', register);
route.post('/login', login);
route.get('/profile', isAuth, getUserProfile);

export default route;
