import db from '../database.js';  // Import db.query

const Developer = {
    async createDeveloper(developerData, role) {
        try {
            console.log("role",role)
            const sql = `
                INSERT INTO developers (first_name, last_name, email, password)
                VALUES (?, ?, ?, ?)
            `;
            const params = [
                developerData.first_name,
                developerData.last_name,
                developerData.email,
                developerData.password,
            ];

            const result = await db.query(sql, params, 'default');  // Pass role to db.query
            return {
                ...developerData,
                developer_id: result.insertId,  // Return the ID of the newly inserted developer
            };
        } catch (error) {
            console.error('Error creating developer:', error);
            throw error;
        }
    },

    async updateDeveloper(developerId, updateData, role) {
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
                developerId,
            ];

            const result = await db.query(sql, params, role);  // Pass role to db.query
            return result;
        } catch (error) {
            console.error('Error updating developer:', error);
            throw error;
        }
    },

    async findDeveloperById(developerId, role) {
        try {
            const sql = 'SELECT * FROM developers WHERE developer_id = ?';
            const developers = await db.query(sql, [developerId], role);  // Pass role to db.query
            return developers[0];
        } catch (error) {
            console.error('Error finding developer by ID:', error);
            throw error;
        }
    },

    async findDeveloperByEmail(email, role) {
        try {
            console.log(role)
            const sql = 'SELECT * FROM developers WHERE email = ?';
            const developers = await db.query(sql, [email], 'default');  // Pass role to db.query
            return developers[0];
        } catch (error) {
            console.error('Error finding developer by email:', error);
            throw error;
        }
    },

    async deleteDeveloper(developerId, role) {
        try {
            const sql = 'DELETE FROM developers WHERE developer_id = ?';
            return await db.query(sql, [developerId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error deleting developer:', error);
            throw error;
        }
    },

    async getAllDevelopers(role) {
        try {
            const sql = 'SELECT * FROM developers';
            const developers = await db.query(sql, [], role);  // Pass role to db.query
            return developers;
        } catch (error) {
            console.error('Error retrieving all developers:', error);
            throw error;
        }
    },
};

export default Developer;
