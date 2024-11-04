import { User,Admin,Developer } from '../database.js';

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
            const user = await User.getUserWithPets(userId);
    
            if (!user) {
                return { error: 'User not found' };
            }
    
            return {
                id: user.user_id,
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
                id: user.user_id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                tel: user.tel,
                pet_count: user.pet_count
            }));
        } catch (error) {
            console.error('Error in getAllUsersAndPetCount:', error);
            return { error: 'Error retrieving users' };
        }
    },
    async getAdminProfile(userId) {
        try {
            const admin = await Admin.findAdminById(userId);

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
    async getDeveloperProfile(userId) {
        try {
            const dev = await Developer.findDeveloperById(userId);

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
