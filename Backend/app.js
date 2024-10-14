import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import cors
import route from './routes/router.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath

dotenv.config();

const app = express();

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(cors());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api", route);

export default app;
