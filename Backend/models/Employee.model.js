import db from '../database.js';  // Import db.query function

const Employee = {
    async createTable(role) {
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
        return db.query(sql, [], role);  // Use db.query here with role
    },

    async addEmployeeAndService(employeeData, role) {
        const sql = `
            INSERT INTO employees (first_name, last_name, email)
            VALUES (?, ?, ?)
        `;
        const employeeParams = [
            employeeData.first_name,
            employeeData.last_name,
            employeeData.email
        ];

        try {
            const result = await db.query(sql, employeeParams, role); // Use db.query
            const employeeId = result.insertId;

            const assignmentDate = employeeData.assignment_date
                ? new Date(employeeData.assignment_date).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10);

            const insertServiceAssignmentSql = `
                INSERT INTO service_assignments (employee_id, service_id, assignment_date)
                VALUES (?, ?, ?)
            `;
            const serviceParams = [
                employeeId,
                employeeData.service_id,
                assignmentDate
            ];
            await db.query(insertServiceAssignmentSql, serviceParams, role);  // Use db.query

            return {
                message: "Employee added successfully",
                newEmployee: {
                    employee_id: employeeId,
                    first_name: employeeData.first_name,
                    last_name: employeeData.last_name,
                    email: employeeData.email,
                    service_id: employeeData.service_id
                }
            };
        } catch (error) {
            console.error('Error adding new employee and service assignment:', error);
            throw error;
        }
    },

    async updateEmployee(employeeId, updateData, role) {
        const updateEmployeeSql = `
            UPDATE employees 
            SET first_name = ?, last_name = ?, email = ? 
            WHERE employee_id = ?
        `;
        const employeeParams = [
            updateData.first_name,
            updateData.last_name,
            updateData.email,
            employeeId
        ];
    
        const updateServiceAssignmentSql = `
            UPDATE service_assignments
            SET service_id = ?
            WHERE employee_id = ?
        `;
        const serviceAssignmentParams = [
            updateData.service_id, 
            employeeId
        ];
    
        try {

            await db.query(updateEmployeeSql, employeeParams, role);

            await db.query(updateServiceAssignmentSql, serviceAssignmentParams, role);
    
            return { message: "Employee and service assignment updated successfully" };
        } catch (error) {
            console.error('Error updating employee and service assignment:', error);
            throw error;
        }
    },    

    async findEmployeesWithServices(serviceId, role) {
        const sql = `
            SELECT e.employee_id, e.first_name, e.last_name, e.email, s.service_name
            FROM employees e
            JOIN service_assignments sa ON e.employee_id = sa.employee_id
            JOIN services s ON sa.service_id = s.service_id
            WHERE s.service_id = ?
            ORDER BY e.employee_id;
        `;
        return db.query(sql, [serviceId], role);  // Use db.query with role
    },

    async deleteEmployee(employeeId, role) {
        const sql = 'DELETE FROM employees WHERE employee_id = ?';
        return db.query(sql, [employeeId], role);  // Use db.query with role
    },

    async getRandomEmployeeForService(service_id, role) {
        console.log("service_id", service_id);
        console.log("role", role);
    
        const sql = `
                SELECT e.employee_id 
                FROM employees e
                JOIN service_assignments sa ON e.employee_id = sa.employee_id
                WHERE sa.service_id = ? 
                ORDER BY RAND() 
                LIMIT 1
            `;
    
        // Pass only the necessary parameters for the query
        const [employees] = await db.query(sql, [service_id],role);  
        return employees;
    },    

    async findEmployeeByDetails(first_name, last_name, email, role) {
        const sql = 'SELECT * FROM employees WHERE first_name = ? AND last_name = ? AND email = ?';
        const [employees] = await db.query(sql, [first_name, last_name, email], role);  // Use db.query with role
        return employees;
    }
};

export default Employee;
