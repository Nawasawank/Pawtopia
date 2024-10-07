// Import the necessary modules
import { Router } from 'express';
import { register } from '../controllers/SignUp.controller.js';

// Initialize the router
const route = Router();

// Define the route for user registration
route.post('/register', register);

// Export the router
export default route;
