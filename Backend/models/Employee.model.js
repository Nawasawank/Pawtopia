export default function EmployeeModel(db) {
    const Employee = {
        createTable: async () => {
            const sql = `
                CREATE TABLE IF NOT EXISTS employees (
                    employee_id INT AUTO_INCREMENT PRIMARY KEY,
                    first_name VARCHAR(255) NOT NULL,
                    last_name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );
            `;
            await db.query(sql);
        },

        createEmployee: async (employeeData) => {
            try {
                const sql = `
                    INSERT INTO employees (first_name, last_name, email) 
                    VALUES (?, ?, ?)
                `;
                const params = [
                    employeeData.first_name,
                    employeeData.last_name,
                    employeeData.email
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error creating employee:', error);
                throw error;
            }
        },

        updateEmployee: async (employeeId, updateData) => {
            try {
                const sql = `
                    UPDATE employees 
                    SET first_name = ?, last_name = ?, email = ?
                    WHERE employee_id = ?
                `;
                const params = [
                    updateData.first_name,
                    updateData.last_name,
                    updateData.email,
                    employeeId
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating employee:', error);
                throw error;
            }
        },

        findEmployeeById: async (employeeId) => {
            const sql = 'SELECT * FROM employees WHERE employee_id = ?';
            const employees = await db.query(sql, [employeeId]);
            return employees[0];
        },

        findAllEmployees: async () => {
            const sql = 'SELECT * FROM employees';
            return db.query(sql);
        },

        deleteEmployee: async (employeeId) => {
            const sql = 'DELETE FROM employees WHERE employee_id = ?';
            return db.query(sql, [employeeId]);
        }
    };

    return Employee;
}
