import { User } from '../database.js';

const UpdatePhotoService = {
    async updateProfileImage(userId, profileImagePath) {
        try {
            const updateResult = await User.updateUserImage(userId, profileImagePath);

            if (updateResult.affectedRows === 0) {
                return { error: 'Failed to update profile image' };
            }

            const updatedUser = await User.findUserById(userId);
            return updatedUser;
        } catch (error) {
            console.error(`Error updating profile image: ${error.message}`);
            return { error: 'Error updating profile image' };
        }
    }
};

export default UpdatePhotoService;
