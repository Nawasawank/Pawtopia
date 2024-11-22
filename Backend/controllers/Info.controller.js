import InfoService from '../services/Info.service.js';

const InfoController = {
    async getUserProfile(req, res) {
        const { id: userId, role } = req.user; 

        try {
            const user = await InfoService.getUserProfile(userId, role); 

            if (user.error) {
                return res.status(500).json({ error: user.error });
            }

            return res.status(200).json({ firstName: user.firstName, image: user.image });
        } catch (error) {
            console.error(`Error in getUserProfile: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getUserInfo(req, res) {
        const { id: userId, role } = req.user; 
    
        try {
            const user = await InfoService.getUserInfo(userId, role); 
    
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            return res.status(200).json({
                user_id: user.user_id,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                email: user.email,
                tel: user.tel,
                image: user.image,
                pets: user.pets
            });
        } catch (error) {
            console.error(`Error in getUserInfo: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getUserInfoAndPetCount(req, res) {
        try {
            const { id: userId, role } = req.user;
            const users = await InfoService.getAllUsersAndPetCount(userId,role);
    
            if (!users || users.length === 0) {
                return res.status(404).json({ error: 'No users found' });
            }
    
            const formattedUsers = users.map(user => ({
                user_id: user.user_id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                tel: user.tel,
                image: user.image,
                pet_count: user.pet_count
            }));
    
            return res.status(200).json(formattedUsers);
        } catch (error) {
            console.error(`Error in getUserInfoAndPetCount: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getAdminProfile(req, res) {
        const { id: userId, role } = req.user;

        try {
            const admin = await InfoService.getAdminProfile(userId, role);

            if (admin.error) {
                return res.status(500).json({ error: admin.error });
            }

            return res.status(200).json({ Name: admin.name });
        } catch (error) {
            console.error(`Error in getUserProfile: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getDeveloperProfile(req, res) {
        const { id: userId, role } = req.user;
        console.log('checkkkk',role)

        try {
            const dev = await InfoService.getDeveloperProfile(userId, role); 

            if (dev.error) {
                return res.status(500).json({ error: dev.error });
            }

            return res.status(200).json({ Name: dev.name });
        } catch (error) {
            console.error(`Error in getUserProfile: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async updateUserInfo(req, res) {
        const { id: userId, role } = req.user;
        const userUpdateData = req.body; 
    
        try {
            const updatedUser = await InfoService.updateUserInfo(userId, userUpdateData, role);
    
            return res.status(200).json({
                message: 'User information updated successfully',
                user: updatedUser,
            });
        } catch (error) {
            console.error('Error in updateUserInfo:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async updatePetInfo(req, res) {
        const { petId } = req.params; 
        const petUpdateData = req.body; 
        const { role } = req.user; 
    
        try {
            const updatedPet = await InfoService.updatePetInfo(petId, petUpdateData, role);
    
            return res.status(200).json({
                message: 'Pet information updated successfully',
                pet: updatedPet,
            });
        } catch (error) {
            console.error('Error in updatePetInfo:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    
};

export default InfoController;
