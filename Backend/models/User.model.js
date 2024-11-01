export default function UserModel(db) {
    const User = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS users (
                    user_id INT AUTO_INCREMENT PRIMARY KEY,
                    firstName VARCHAR(255) NOT NULL,
                    lastName VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    tel VARCHAR(50) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    image VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );
            `;
            await db.query(sql);
        },

        async createUser(userData) {
            try {
                const sql = `
                    INSERT INTO users (firstName, lastName, email, tel, password, image) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                const params = [
                    userData.firstName,
                    userData.lastName,
                    userData.email,
                    userData.tel,
                    userData.password,
                    userData.image || null 
                ];
                
                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error creating user:', error);
                throw error;
            }
        },

        async updateUser(userId, updateData) {
            try {

                const sql = `
                    UPDATE users 
                    SET firstName = ?, lastName = ?, email = ?, tel = ?, password = ?, image = ?
                    WHERE user_id = ?
                `;
                const params = [
                    updateData.firstName,
                    updateData.lastName,
                    updateData.email,
                    updateData.tel,
                    updateData.password,
                    updateData.image || null,
                    userId
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating user:', error);
                throw error;
            }
        },

        async findUserByEmail(email) {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const users = await db.query(sql, [email]);
            return users[0]; 
        },

        async findUserById(userId) {
            const sql = 'SELECT * FROM users WHERE user_id = ?';
            const users = await db.query(sql, [userId]);
            return users[0];
        },

        async findUserByTel(tel) {
            const sql = 'SELECT * FROM users WHERE tel = ?';
            const users = await db.query(sql, [tel]);
            return users[0]; 
        },

        async getUserWithPets(userId) {
            const sql = `
                SELECT users.*, pets.pet_id, pets.name AS pet_name, pets.type AS pet_type, 
                       pets.gender AS pet_gender, pets.weight AS pet_weight, 
                       pets.health_condition_id
                FROM users
                LEFT JOIN pets ON users.user_id = pets.user_id
                WHERE users.user_id = ?
            `;
            const rows = await db.query(sql, [userId]);
        
            if (rows.length === 0) {
                return null;
            }
        
            const user = {
                user_id: rows[0].user_id,
                firstName: rows[0].firstName,
                lastName: rows[0].lastName,
                email: rows[0].email,
                tel: rows[0].tel,
                pets: []
            };
        
            user.pets = rows
                .filter(row => row.pet_id !== null)
                .map(row => ({
                    pet_id: row.pet_id,
                    name: row.pet_name,
                    type: row.pet_type,
                    gender: row.pet_gender,
                    weight: row.pet_weight,
                    health_condition_id: row.health_condition_id,
                }));
        
            return user;
        },          

        async updateUserImage(userId, imagePath) {
            try {
                const sql = `
                    UPDATE users 
                    SET image = ?
                    WHERE user_id = ?
                `;
                const params = [imagePath, userId];
        
                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating user image:', error);
                throw error;
            }
        },
        async getUserBookings(userId, startDate, endDate) {
            const otherServicesSql = `
                SELECT 
                    p.name AS pet_name,
                    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                    s.service_name,
                    o.booking_id,
                    o.booking_date AS date,
                    'other_service' AS booking_type
                FROM services_bookings o
                JOIN pets p ON o.pet_id = p.pet_id
                JOIN employees e ON o.employee_id = e.employee_id
                JOIN services s ON o.service_id = s.service_id
                WHERE p.user_id = ?
                AND (o.booking_date BETWEEN ? AND ? OR o.booking_date = ? OR o.booking_date = ?)
            `;
        
           
            
            const params = [userId, startDate, endDate, startDate, endDate];
          
            
            const otherServicesBookings = await db.query(otherServicesSql, params);
            
            const bookings = [...otherServicesBookings];
            return bookings;
        },
        async getAllUsersWithPetCount() {
            const sql = `
                SELECT users.user_id, users.firstName, users.lastName, users.email, users.tel, users.image,
                       COUNT(pets.pet_id) AS pet_count
                FROM users
                LEFT JOIN pets ON users.user_id = pets.user_id
                GROUP BY users.user_id
            `;
            const rows = await db.query(sql);
    
            return rows.map(row => ({
                user_id: row.user_id,
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                tel: row.tel,
                image: row.image,
                pet_count: row.pet_count
            }));
        }        
        
    };

    return User;
}
