export default function AdminModel(db) {
    const Admin = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS admins (
                    admin_id INT AUTO_INCREMENT PRIMARY KEY,
                    employee_id INT UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
                );
            `;
            await db.query(sql);
        },

        async createAdmin(adminData) {
            try {
                const sql = `
                    INSERT INTO admins (employee_id, password) 
                    VALUES (?, ?)
                `;
                const params = [
                    adminData.employee_id,
                    adminData.password
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error creating admin:', error);
                throw error;
            }
        },

        async updateAdmin(adminId, updateData) {
            try {
                const sql = `
                    UPDATE admins 
                    SET employee_id = ?, password = ? 
                    WHERE admin_id = ?
                `;
                const params = [
                    updateData.employee_id,
                    updateData.password, // Assuming password is already hashed
                    adminId
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating admin:', error);
                throw error;
            }
        },

        async findAdminById(adminId) {
            const sql = 'SELECT * FROM admins WHERE admin_id = ?';
            const admins = await db.query(sql, [adminId]);
            return admins[0];
        },

        async findAdminByEmployeeId(employeeId) {
            const sql = 'SELECT * FROM admins WHERE employee_id = ?';
            const admins = await db.query(sql, [employeeId]);
            return admins[0];
        },

        async deleteAdmin(adminId) {
            const sql = 'DELETE FROM admins WHERE admin_id = ?';
            return db.query(sql, [adminId]);
        }
    };

    return Admin;
}
