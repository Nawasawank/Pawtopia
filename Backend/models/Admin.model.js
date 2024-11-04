export default function AdminModel(db) {
    const Admin = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS emp_admins (
                employee_id INT PRIMARY KEY,
                email VARCHAR(255),
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
                    INSERT INTO emp_admins (employee_id,email, password) 
                    VALUES (?, ?, ?)
                `;
                const params = [
                    adminData.employee_id,
                    adminData.email,
                    adminData.password
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error creating admin:', error);
                throw error;
            }
        },

        async updateAdmin(employee_id, updateData) {
            try {
                const sql = `
                    UPDATE emp_admins
                    SET employee_id = ?, password = ? 
                    WHERE employee_id = ?
                `;
                const params = [
                    updateData.employee_id,
                    updateData.password,
                    employee_id
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating admin:', error);
                throw error;
            }
        },

        async findAdminById(adminId) {
            const sql = `
                SELECT * 
                FROM emp_admins 
                JOIN employees ON emp_admins.employee_id = employees.employee_id 
                WHERE emp_admins.employee_id = ?
            `;
            const admins = await db.query(sql, [adminId]);
            return admins[0];
        },             

        async findAdminByEmployeeId(employeeId) {
            const sql = 'SELECT * FROM emp_admins WHERE employee_id = ?';
            const admins = await db.query(sql, [employeeId]);
            return admins[0];
        },

        async findAdminByEmail(email) {
            const sql = `
                SELECT *
                FROM emp_admins
                JOIN employees ON emp_admins.employee_id = employees.employee_id 
                WHERE employees.email = ?
            `;
            const admins = await db.query(sql, [email]);
            return admins[0];
        },

        async findAdminByTel(tel) {
            const sql = `
                SELECT admins.* 
                FROM admins 
                JOIN employees ON emp_admins.employee_id = employees.employee_id 
                WHERE employees.tel = ?
            `;
            const admins = await db.query(sql, [tel]);
            return admins[0];
        },

        async deleteAdmin(adminId) {
            const sql = 'DELETE FROM emp_admins WHERE employee_id = ?';
            return db.query(sql, [adminId]);
        },

        async findRandomAdminId() {
            const sql = `SELECT employee_id FROM emp_admins ORDER BY RAND() LIMIT 1`;
            const result = await db.query(sql);
            return result;
        }
    };

    return Admin;
}
