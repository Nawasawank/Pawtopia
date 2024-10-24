export default function ServiceModel(db) {
    const Service = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS services (
                    service_id INT AUTO_INCREMENT PRIMARY KEY,
                    service_name VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );
            `;
            await db.query(sql);
        },

        async createService(serviceData) {
            try {
                const sql = `
                    INSERT INTO services (service_name) 
                    VALUES (?)
                `;
                const params = [serviceData.service_name];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error creating service:', error);
                throw error;
            }
        },

        async updateService(serviceId, updateData) {
            try {
                const sql = `
                    UPDATE services 
                    SET service_name = ?
                    WHERE service_id = ?
                `;
                const params = [
                    updateData.service_name,
                    serviceId
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating service:', error);
                throw error;
            }
        },

        async findServiceById(serviceId) {
            const sql = 'SELECT * FROM services WHERE service_id = ?';
            const services = await db.query(sql, [serviceId]);
            return services[0];
        },

        async findAllServices() {
            const sql = 'SELECT * FROM services';
            return db.query(sql);
        },

        async deleteService(serviceId) {
            const sql = 'DELETE FROM services WHERE service_id = ?';
            return db.query(sql, [serviceId]);
        }
    };

    return Service;
}
