import User from '../models/User.model.js';
import Admin from '../models/Admin.model.js';
import Developer from '../models/Developer.model.js';

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

    async getAllUsersAndPetCount() {
        try {
            const users = await User.getAllUsersWithPetCount();
    
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
};

export default InfoService;
