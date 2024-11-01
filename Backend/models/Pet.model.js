export default function PetModel(db) {
    const Pet = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS pets (
                pet_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                name VARCHAR(255) NOT NULL,
                gender VARCHAR(50) NOT NULL,
                type VARCHAR(50) NOT NULL,
                weight VARCHAR(50),
                health_condition_id INT ,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX (health_condition_id),
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
            `;
            await db.query(sql);
        },

        async createPet(petData) {

            try {
                const sql = `
                    INSERT INTO pets (user_id, name, gender, type, health_condition_id, weight) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                const params = [
                    petData.user_id,
                    petData.name,
                    petData.gender,
                    petData.type,
                    petData.health_condition_id ,
                    petData.weight
                ];

                const result = await db.query(sql, params);
                const newPet = await Pet.findPetById(result.insertId);
                return newPet;
            } catch (error) {
                console.error('Error creating pet:', error);
                throw error;
            }
        },

        async updatePet(petId, updateData) {
            try {
                const sql = `
                    UPDATE pets 
                    SET name = ?, gender = ?, type = ?, Health_Condition = ?, weight = ?
                    WHERE pet_id = ?
                `;
                const params = [
                    updateData.name,
                    updateData.gender,
                    updateData.type,
                    updateData.Health_Condition || null,
                    updateData.weight || null,
                    petId
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating pet:', error);
                throw error;
            }
        },

        async findPetById(petId) {
            const sql = `
                SELECT pets.*, health_conditions.health_condition
                FROM pets
                LEFT JOIN health_conditions ON pets.health_condition_id = health_conditions.health_condition_id
                WHERE pets.pet_id = ?
            `;
            const pets = await db.query(sql, [petId]);
            return pets[0];
        },
        
        async findPetsByUserId(userId) {
            const sql = `
                SELECT pets.*, health_conditions.health_condition
                FROM pets
                LEFT JOIN health_conditions ON pets.health_condition_id = health_conditions.health_condition_id
                WHERE pets.user_id = ?
            `;
            return db.query(sql, [userId]);
        },
        
        async deletePet(petId) {
            const sql = 'DELETE FROM pets WHERE pet_id = ?';
            return db.query(sql, [petId]);
        },

        async findPetNamesAndTypesByUserId(userId) {
            const sql = 'SELECT pet_id, name, type FROM pets WHERE user_id = ?';
            return db.query(sql, [userId]);
        },
        async findAllPet(userId) {
            const sql = 'SELECT * FROM pets WHERE user_id = ?';
            return db.query(sql, [userId]);
        }
    };

    return Pet;
}
