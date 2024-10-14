import multer from 'multer';
import path from 'path';
import fs from 'fs'; 
import { fileURLToPath } from 'url'; 

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define the path to the backend 'uploads/profile-images' folder
        const backendImagePath = path.join(__dirname, '../uploads');

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(backendImagePath)) {
            fs.mkdirSync(backendImagePath, { recursive: true }); // Recursively create the directory
        }

        cb(null, backendImagePath);  // Store images in this folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));  // Generate a unique filename
    }
});

// Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },  // Limit file size to 2MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only images (jpeg, jpg, png) are allowed!');
        }
    }
});

// Export the configured multer instance
export default upload;
