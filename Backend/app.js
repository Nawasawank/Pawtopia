import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import cors
import route from './routes/router.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api", route);

export default app;
