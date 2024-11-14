import db from '../database.js';

const Service = {
    async createService(serviceData, role) {
        try {
            const sql = `
                INSERT INTO services (service_name) 
                VALUES (?)
            `;
            const params = [serviceData.service_name];

            const result = await db.query(sql, params, role);  // Pass role to db.query
            return await this.findServiceById(result.insertId, role); // Return the created service
        } catch (error) {
            console.error('Error creating service:', error);
            throw error;
        }
    },

    async updateService(serviceId, updateData, role) {
        try {
            const sql = `
                UPDATE services 
                SET service_name = ?
                WHERE service_id = ?
            `;
            const params = [updateData.service_name, serviceId];

            await db.query(sql, params, role);  // Pass role to db.query
            return await this.findServiceById(serviceId, role); // Return the updated service
        } catch (error) {
            console.error('Error updating service:', error);
            throw error;
        }
    },

    async findServiceById(serviceId, role) {
        try {
            const sql = 'SELECT * FROM services WHERE service_id = ?';
            const services = await db.query(sql, [serviceId], role);  // Pass role to db.query
            return services[0] || null; // Return null if not found
        } catch (error) {
            console.error('Error finding service by ID:', error);
            throw error;
        }
    },

    async findAllServices(role) {
        try {
            const sql = 'SELECT * FROM services';
            return await db.query(sql, [], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error retrieving all services:', error);
            throw error;
        }
    },

    async deleteService(serviceId, role) {
        try {
            const sql = 'DELETE FROM services WHERE service_id = ?';
            return await db.query(sql, [serviceId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    },
};

export default Service;
