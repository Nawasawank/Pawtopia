import db from '../database.js';

const { User } = db;

export const getUserInfo = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            attributes: ['firstName', 'image'],
        });

        if (!user) {
            return { error: 'User not found' };
        }
        return user; 
    } catch (error) {
        console.error(`Error fetching user info: ${error.message}`);
        return { error: 'Error fetching user info' };
    }
};
