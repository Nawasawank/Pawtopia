import { User } from '../database.js';

const InfoService = {
    async getUserProfile(userId) {
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
    },
    async getUserInfo(userId) {
        try {
            const user = await User.findUserById(userId);
            if (!user) {
                return { error: 'User not found' };
            }

            return {
                id: userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                tel: user.tel,
                image: user.image
            };
        } catch (error) {
            console.error('Error in getUserProfile:', error);
            return { error: 'Error retrieving user profile' };
        }
    },
};

export default InfoService;
