import path from 'path';
import { updateProfileImage } from '../services/UpdatePhoto.service.js';

export const uploadProfileImage = async (req, res) => {
    const { userId } = req.body;
    console.log(userId);

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const profileImagePath = `/uploads/${req.file.filename}`;

        const result = await updateProfileImage(userId, profileImagePath);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        return res.status(200).json({ 
            message: 'Profile image uploaded successfully', 
            profileImage: `http://localhost:5000${profileImagePath}`
        });
    } catch (error) {
        console.error(`Unexpected error: ${error.message}`);
        return res.status(500).send('Internal Server Error');
    }
};
