export default function DeveloperModel(db) {
    const Developer = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS developers (
                    developer_id INT AUTO_INCREMENT PRIMARY KEY,
                    first_name VARCHAR(100),
                    last_name VARCHAR(100),
                    email VARCHAR(100) UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );
            `;
            await db.query(sql);
        },

        async createDeveloper(developerData) {
            try {
                const sql = `
                    INSERT INTO developers (first_name, last_name, email, password)
                    VALUES (?, ?, ?, ?)
                `;
                const params = [
                    developerData.first_name,
                    developerData.last_name,
                    developerData.email,
                    developerData.password 
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error creating developer:', error);
                throw error;
            }
        },

        async updateDeveloper(developerId, updateData) {
            try {
                const sql = `
                    UPDATE developers 
                    SET first_name = ?, last_name = ?, email = ?, password = ?
                    WHERE developer_id = ?
                `;
                const params = [
                    updateData.first_name,
                    updateData.last_name,
                    updateData.email,
                    updateData.password,
                    developerId
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating developer:', error);
                throw error;
            }
        },

        async findDeveloperById(developerId) {
            const sql = 'SELECT * FROM developers WHERE developer_id = ?';
            const developers = await db.query(sql, [developerId]);
            return developers[0];
        },

        async findDeveloperByEmail(email) {
            const sql = 'SELECT * FROM developers WHERE email = ?';
            const developers = await db.query(sql, [email]);
            return developers[0];
        },

        async deleteDeveloper(developerId) {
            const sql = 'DELETE FROM developers WHERE developer_id = ?';
            return db.query(sql, [developerId]);
        },

        async getAllDevelopers() {
            const sql = 'SELECT * FROM developers';
            return db.query(sql);
        }
    };

    return Developer;
}
