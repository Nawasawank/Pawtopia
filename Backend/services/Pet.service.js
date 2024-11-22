import Pet from "../models/Pet.model.js";

const PetService = {
    async addPet(userId, petData, role) {
        try {
            // Ensure all fields are not empty
            if (
                !petData.name ||
                !petData.type ||
                !petData.gender ||
                !petData.weight ||
                !petData.health_condition_id
            ) {
                return { error: 'All fields are required' };
            }
    
            const newPet = await Pet.createPet({ ...petData, user_id: userId }, role);
            return newPet;
        } catch (error) {
            console.error(`Error adding pet: ${error.message}`);
            return { error: 'Error adding pet' };
        }
    },    

    async deletePet(userId, petId, role) {
        try {
            const pet = await Pet.findPetById(petId, role);  

            if (!pet) {
                return { error: 'Pet not found' };
            }

            if (pet.user_id !== userId) {
                return { error: 'You are not authorized to delete this pet' };
            }

            await Pet.deletePet(petId, role);  // Pass role
            return { message: 'Pet deleted successfully' };
        } catch (error) {
            console.error(`Error deleting pet: ${error.message}`);
            return { error: 'Error deleting pet' };
        }
    },

    async findPetNamesAndTypes(userId, role) {
        try {
            const pets = await Pet.findPetNamesAndTypesByUserId(userId, role);  // Pass role
            return pets;
        } catch (error) {
            console.error(`Error fetching pet names and types: ${error.message}`);
            return { error: 'Error fetching pet names and types' };
        }
    },

    async findPet(userId, role) {
        try {
            const pets = await Pet.findPetsByUserId(userId, role);  // Pass role
            return pets;
        } catch (error) {
            console.error(`Error fetching pet names and types: ${error.message}`);
            return { error: 'Error fetching pet names and types' };
        }
    }
};

export default PetService;
