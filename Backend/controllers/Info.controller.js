import InfoService from '../services/Info.service.js';

const InfoController = {
    async getUserProfile(req, res) {
        const { id: userId } = req.user;

        try {
            const user = await InfoService.getUserProfile(userId);

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
        const { id: userId } = req.user;
    
        try {
            const user = await InfoService.getUserInfo(userId);
    
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            return res.status(200).json({
                user_id: user.user_id,
                firstName: user.firstName,
                lastName: user.lastName,
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
            const users = await InfoService.getAllUsersAndPetCount();
    
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
    }    
    
    
};

export default InfoController;
