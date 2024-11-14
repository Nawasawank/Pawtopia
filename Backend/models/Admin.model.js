import db from '../database.js';  // Import db.query

const Admin = {
    async createAdmin(adminData, role) {
        try {
            const sql = `
                INSERT INTO emp_admins (employee_id, email, password) 
                VALUES (?, ?, ?)
            `;
            const params = [
                adminData.employee_id,
                adminData.email,
                adminData.password,
            ];
            const result = await db.query(sql, params, role);  // Pass role to db.query
            return result;
        } catch (error) {
            console.error('Error creating admin:', error);
            throw error;
        }
    },

    async updateAdminPassword(employee_id, newPassword, role) {
        try {
            const sql = `
                UPDATE emp_admins
                SET password = ? 
                WHERE employee_id = ?
            `;
            const params = [newPassword, employee_id];
            const result = await db.query(sql, params, role);  // Pass role to db.query
            return result;
        } catch (error) {
            console.error('Error updating admin password:', error);
            throw error;
        }
    },

    async findAdminById(adminId, role) {
        try {
            const sql = `
                SELECT emp_admins.*, employees.first_name, employees.last_name
                FROM emp_admins 
                JOIN employees ON emp_admins.employee_id = employees.employee_id 
                WHERE emp_admins.employee_id = ?
            `;
            const admins = await db.query(sql, [adminId], role);  // Pass role to db.query
            return admins[0];
        } catch (error) {
            console.error('Error finding admin by ID:', error);
            throw error;
        }
    },    

    async findAdminByEmail(email, role) {
        try {
            const sql = `
                SELECT emp_admins.*, employees.first_name, employees.last_name
                FROM emp_admins
                JOIN employees ON emp_admins.employee_id = employees.employee_id 
                WHERE employees.email = ?
            `;
            const admins = await db.query(sql, [email], role);  // Pass role to db.query
            return admins[0];
        } catch (error) {
            console.error('Error finding admin by email:', error);
            throw error;
        }
    },

    async deleteAdmin(adminId, role) {
        try {
            const sql = 'DELETE FROM emp_admins WHERE employee_id = ?';
            return db.query(sql, [adminId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error deleting admin:', error);
            throw error;
        }
    },

    async findRandomAdminId(role) {
        try {
            const sql = `SELECT employee_id FROM emp_admins ORDER BY RAND() LIMIT 1`;
            const result = await db.query(sql, [], role);  // Pass role to db.query
            return result[0];
        } catch (error) {
            console.error('Error finding random admin ID:', error);
            throw error;
        }
    },
};

export default Admin;
