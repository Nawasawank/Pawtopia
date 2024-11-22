import User from '../models/User.model.js';
import Admin from '../models/Admin.model.js';
import Developer from '../models/Developer.model.js';
import Pet from '../models/Pet.model.js';

const InfoService = {
    async getUserProfile(userId, role) {
        try {
            const user = await User.findUserById(userId, role);  // Pass role to model method

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

    async getUserInfo(userId, role) {
        try {
            const user = await User.getUserWithPets(userId, role);  // Pass role to model method
    
            if (!user) {
                return { error: 'User not found' };
            }
    
            return {
                user_id: user.user_id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                tel: user.tel,
                image: user.image,
                pets: user.pets
            };
        } catch (error) {
            console.error('Error in getUserInfo:', error);
            return { error: 'Error retrieving user profile' };
        }
    },

    async getAllUsersAndPetCount(userId,role) {
        try {
            const users = await User.getAllUsersWithPetCount(userId,role);
    
            if (!users || users.length === 0) {
                return { error: 'No users found' };
            }
    
            return users.map(user => ({
                user_id: user.user_id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                tel: user.tel,
                image: user.image,
                pet_count: user.pet_count
            }));
        } catch (error) {
            console.error('Error in getAllUsersAndPetCount:', error);
            return { error: 'Error retrieving users' };
        }
    },

    async getAdminProfile(userId, role) {
        try {
            const admin = await Admin.findAdminById(userId, role);  // Pass role to model method

            if (!admin) {
                return { error: 'Admin not found' };
            }

            return {
                name: admin.first_name,
            };
        } catch (error) {
            console.error(`Error fetching admin info: ${error.message}`);
            return { error: 'Error fetching admin info' };
        }
    },

    async getDeveloperProfile(userId, role) {
        try {
            const dev = await Developer.findDeveloperById(userId, role);  // Pass role to model method

            if (!dev) {
                return { error: 'Developer not found' };
            }

            return {
                name: dev.first_name,
            };
        } catch (error) {
            console.error(`Error fetching dev info: ${error.message}`);
            return { error: 'Error fetching dev info' };
        }
    },
    async updateUserInfo(userId, userUpdateData, role) {
        try {
            // Fetch the current user data
            const currentUser = await User.findUserById(userId, role);
            if (!currentUser) {
                return { error: 'User not found' };
            }
    
            // Merge provided data with existing user data
            const updatedData = {
                firstName: userUpdateData.firstName || currentUser.firstName,
                lastName: userUpdateData.lastName || currentUser.lastName,
                email: userUpdateData.email || currentUser.email,
                tel: userUpdateData.tel || currentUser.tel,
                password: userUpdateData.password || currentUser.password,
            };
    
            // Pass the merged data to the model for updating
            const updatedUser = await User.updateUser(userId, updatedData, role);
    
            if (!updatedUser) {
                return { error: 'User update failed' };
            }
    
            return updatedUser;
        } catch (error) {
            console.error('Error in updateUserInfo:', error);
            throw new Error('Error updating user information');
        }
    },    
    async updatePetInfo(petId, petUpdateData, role) {
        try {
            console.log(petId)
            // Fetch current pet data to ensure pet exists
            const currentPet = await Pet.findPetById(petId, role);
            if (!currentPet) {
                return { error: 'Pet not found' };
            }
    
            // Merge existing pet data with the updated data
            const updatedData = {
                name: petUpdateData.name || currentPet.name,
                gender: petUpdateData.gender || currentPet.gender,
                type: petUpdateData.type || currentPet.type,
                health_condition_id: petUpdateData.health_condition_id || currentPet.health_condition_id,
                weight: petUpdateData.weight || currentPet.weight,
            };
    
            // Call the updatePet method in the model
            const updatedPet = await Pet.updatePet(petId, updatedData, role);
    
            if (!updatedPet) {
                return { error: 'Pet update failed' };
            }
    
            return updatedPet;
        } catch (error) {
            console.error('Error in updatePetInfo:', error);
            throw new Error('Error updating pet information');
        }
    },
    async deleteUserAndPets(userId,role) {
        try {
            // Check if the user exists
            const user = await User.findUserById(userId,role);
            if (!user) {
                throw new Error('User not found');
            }
    
            // Delete the user (pets are deleted automatically via ON DELETE CASCADE)
            const result = await User.deleteUserById(userId,role);
    
            return result; // Return the result of the deletion
        } catch (error) {
            console.error('Error in deleteUserAndPets:', error);
            throw error;
        }
    }
    
    
        
};

export default InfoService;
