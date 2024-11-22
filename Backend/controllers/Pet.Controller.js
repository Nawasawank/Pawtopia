import PetService from '../services/Pet.service.js';

const PetController = {
    async addPet(req, res) {
        const { id: userId, role } = req.user;
        const petData = req.body;
    
        // Validate fields
        if (
            !petData.name ||
            !petData.type ||
            !petData.gender ||
            !petData.weight ||
            !petData.health_condition_id
        ) {
            return res.status(400).json({ error: 'All fields are required' });
        }
    
        try {
            const newPet = await PetService.addPet(userId, petData, role);
    
            if (newPet.error) {
                return res.status(400).json({ error: newPet.error });
            }
    
            return res.status(201).json({
                message: 'Pet added successfully',
                pet: newPet,
            });
        } catch (error) {
            console.error(`Error in addPetController: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },    

    async deletePet(req, res) {
        const { id: userId, role } = req.user;
        const { petId } = req.params;

        try {
            const result = await PetService.deletePet(userId, petId, role); 

            if (result.error) {
                return res.status(400).json({ error: result.error });
            }

            return res.status(200).json({ message: 'Pet deleted successfully' });
        } catch (error) {
            console.error(`Error in deletePetController: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getPetNamesAndTypes(req, res) {
        const { id: userId, role } = req.user; 

        try {
            const pets = await PetService.findPetNamesAndTypes(userId, role);
            if (pets.error) {
                return res.status(400).json({ error: pets.error });
            }

            return res.status(200).json({
                message: 'Pet names and types retrieved successfully',
                pets
            });
        } catch (error) {
            console.error(`Error in getPetNamesAndTypesController: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getPetByUserId(req, res) {
        const { role } = req.user;  
        const { userId } = req.params;
        console.log(userId)

        try {
            const pets = await PetService.findPet(userId, role);  

            if (pets.error) {
                return res.status(400).json({ error: pets.error });
            }

            return res.status(200).json({
                message: 'Pet names and types retrieved successfully',
                pets
            });
        } catch (error) {
            console.error(`Error in getPetNamesAndTypesController: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export default PetController;
