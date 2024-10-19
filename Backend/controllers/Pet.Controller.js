import PetService from '../services/Pet.service.js';

const PetController = {
    async addPet(req, res) {
        const { id: userId } = req.user;
        const petData = req.body;

        try {
            const newPet = await PetService.addPet(userId, petData);

            if (newPet.error) {
                return res.status(400).json({ error: newPet.error });
            }

            return res.status(201).json({
                message: 'Pet added successfully',
                pet: newPet
            });
        } catch (error) {
            console.error(`Error in addPetController: ${error.message}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deletePet(req, res) {
        const { id: userId } = req.user;
        const { petId } = req.params;

        try {
            const result = await PetService.deletePet(userId, petId);

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
        const { id: userId } = req.user;

        try {
            const pets = await PetService.findPetNamesAndTypes(userId);

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
