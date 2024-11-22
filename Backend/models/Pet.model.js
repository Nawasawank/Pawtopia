import db from '../database.js';

const Pet = {
    async createPet(petData, role) {
        try {
            const sql = `
                INSERT INTO pets (user_id, name, gender, type, health_condition_id, weight) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            console.log("iddd",petData.user_id)
            const params = [
                petData.user_id,
                petData.name,
                petData.gender,
                petData.type,
                petData.health_condition_id ,
                petData.weight 
            ];

            const result = await db.query(sql, params, role);  // Pass role to db.query
            return await this.findPetById(result.insertId, role);
        } catch (error) {
            console.error('Error creating pet:', error);
            throw error;
        }
    },

    async updatePet(petId, updateData, role) {
        try {
            const sql = `
                UPDATE pets 
                SET name = ?, gender = ?, type = ?, health_condition_id = ?, weight = ?
                WHERE pet_id = ?
            `;
            const params = [
                updateData.name,
                updateData.gender,
                updateData.type,
                updateData.health_condition_id || null,
                updateData.weight || null,
                petId,
            ];

            await db.query(sql, params, role);  // Pass role to db.query
            return await this.findPetById(petId, role);
        } catch (error) {
            console.error('Error updating pet:', error);
            throw error;
        }
    },

    async findPetById(petId, role) {
        try {
            const sql = `
                SELECT pets.*, health_conditions.health_condition
                FROM pets
                LEFT JOIN health_conditions ON pets.health_condition_id = health_conditions.health_condition_id
                WHERE pets.pet_id = ?
            `;
            const pets = await db.query(sql, [petId], role);  // Pass role to db.query
            return pets[0] || null;
        } catch (error) {
            console.error('Error finding pet by ID:', error);
            throw error;
        }
    },

    async findPetsByUserId(userId, role) {
        try {
            console.log(userId,"eiei")
            const sql = `
                SELECT pets.*, health_conditions.health_condition
                FROM pets
                LEFT JOIN health_conditions ON pets.health_condition_id = health_conditions.health_condition_id
                WHERE pets.user_id = ?
            `;
            return await db.query(sql, [userId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error finding pets by user ID:', error);
            throw error;
        }
    },

    async deletePet(petId, role) {
        try {
            const sql = 'DELETE FROM pets WHERE pet_id = ?';
            return await db.query(sql, [petId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error deleting pet:', error);
            throw error;
        }
    },

    async findPetNamesAndTypesByUserId(userId, role) {
        try {
            const sql = 'SELECT pet_id, name, type FROM pets WHERE user_id = ?';
            return await db.query(sql, [userId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error finding pet names and types by user ID:', error);
            throw error;
        }
    },

    async findAllPets(userId, role) {
        try {
            const sql = 'SELECT * FROM pets WHERE user_id = ?';
            return await db.query(sql, [userId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error finding all pets by user ID:', error);
            throw error;
        }
    },
    async updatePet(petId, updateData, role) {
        try {
            const sql = `
                UPDATE pets
                SET name = ?, gender = ?, type = ?, health_condition_id = ?, weight = ?
                WHERE pet_id = ?
            `;
            const params = [
                updateData.name,
                updateData.gender,
                updateData.type,
                updateData.health_condition_id || null,
                updateData.weight || null,
                petId,
            ];
    
            await db.query(sql, params, role); // Execute the SQL query
            return await this.findPetById(petId, role); // Return the updated pet
        } catch (error) {
            console.error('Error updating pet:', error);
            throw error;
        }
    }
    
};

export default Pet;
