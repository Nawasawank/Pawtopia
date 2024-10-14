import db from '../database.js';

const { User } = db;

export const updateProfileImage = async (userId, profileImagePath) => {
    try {
        // Find the user by their ID
        const user = await User.findByPk(userId);
        console.log(userId);

        if (!user) {
            return { error: 'User not found' };
        }

        // Update the user's image
        user.image = profileImagePath;
        await user.save();

        return user;  // Return the updated user
    } catch (error) {
        console.error(`Error updating profile image: ${error.message}`);
        return { error: 'Error updating profile image' };
    }
};
