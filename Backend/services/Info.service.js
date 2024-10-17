import { User } from '../database.js'; 

export const getUserInfo = async (userId) => {
    try {

        const user = await User.findUserById(userId);

        if (!user) {
            return { error: 'User not found' };
        }

        return {
            firstName: user.firstName,
            image: user.image
        };
    } catch (error) {
        console.error(`Error fetching user info: ${error.message}`);
        return { error: 'Error fetching user info' };
    }
};
