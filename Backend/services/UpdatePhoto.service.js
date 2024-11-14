import User from "../models/User.model.js";

const UpdatePhotoService = {
    async updateProfileImage(userId, profileImagePath, role) {
        try {
            const updateResult = await User.updateUserImage(userId, profileImagePath, role);

            if (updateResult.affectedRows === 0) {
                return { error: 'Failed to update profile image' };
            }

            const updatedUser = await User.findUserById(userId, role);
            return updatedUser;
        } catch (error) {
            console.error(`Error updating profile image: ${error.message}`);
            return { error: 'Error updating profile image' };
        }
    }
};

export default UpdatePhotoService;
