
import { Router } from 'express';
import { register } from '../controllers/SignUp.controller.js';

const route = Router();

route.post('/register', register);

export default route;
