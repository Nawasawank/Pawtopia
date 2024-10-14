import { getUserInfo } from '../services/Info.service.js';

export const getUserProfile = async (req, res) => {
    const { id: userId } = req.user;  
    
    try {
        const user = await getUserInfo(userId); 

        if (user.error) {
            return res.status(404).json({ error: user.error });
        }

        return res.status(200).json({ firstName: user.firstName, image: user.image });
    } catch (error) {
        console.error(`Error in getUserProfile: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
