import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import cors
import route from './routes/router.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS
app.use(cors()); // Add CORS middleware here

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use the API routes
app.use("/api", route);

// Export the app
export default app;
