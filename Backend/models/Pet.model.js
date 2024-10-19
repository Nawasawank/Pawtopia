export default function PetModel(db) {
    const Pet = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS pets (
                    pet_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT,
                    name VARCHAR(255) NOT NULL,
                    vaccination VARCHAR(255) NOT NULL,
                    gender VARCHAR(50) NOT NULL,
                    type VARCHAR(50) NOT NULL,
                    Health_Condition VARCHAR(255),
                    weight VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
                );
            `;
            await db.query(sql);
        },

        async createPet(petData) {
            try {
                const sql = `
                    INSERT INTO pets (user_id, name, vaccination, gender, type, Health_Condition, weight) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                const params = [
                    petData.user_id,
                    petData.name,
                    petData.vaccination,
                    petData.gender,
                    petData.type,
                    petData.Health_Condition || null,
                    petData.weight || null
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
                    SET name = ?, vaccination = ?, gender = ?, type = ?, Health_Condition = ?, weight = ?
                    WHERE pet_id = ?
                `;
                const params = [
                    updateData.name,
                    updateData.vaccination,
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
            const sql = 'SELECT * FROM pets WHERE pet_id = ?';
            const pets = await db.query(sql, [petId]);
            return pets[0];
        },

        async findPetsByUserId(userId) {
            const sql = 'SELECT * FROM pets WHERE user_id = ?';
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
    };

    return Pet;
}
