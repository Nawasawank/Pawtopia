import { Pet } from '../database.js';

const PetService = {
    async addPet(userId, petData) {
        try {
            const newPet = await Pet.createPet({ ...petData, user_id: userId });
            return newPet;
        } catch (error) {
            console.error(`Error adding pet: ${error.message}`);
            return { error: 'Error adding pet' };
        }
    },

    async deletePet(userId, petId) {
        try {
            const pet = await Pet.findPetById(petId);

            if (!pet) {
                return { error: 'Pet not found' };
            }

            if (pet.user_id !== userId) {
                return { error: 'You are not authorized to delete this pet' };
            }

            await Pet.deletePet(petId);
            return { message: 'Pet deleted successfully' };
        } catch (error) {
            console.error(`Error deleting pet: ${error.message}`);
            return { error: 'Error deleting pet' };
        }
    },

    async findPetNamesAndTypes(userId) {
        try {
            const pets = await Pet.findPetNamesAndTypesByUserId(userId);
            return pets;
        } catch (error) {
            console.error(`Error fetching pet names and types: ${error.message}`);
            return { error: 'Error fetching pet names and types' };
        }
    }
};

export default PetService;
