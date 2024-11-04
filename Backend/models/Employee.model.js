import { pool } from '../database.js';
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

        addEmployeeAndService: async (employeeData) => {
            const connection = await pool.getConnection();

            try {
                await connection.beginTransaction();

                const insertEmployeeSql = `
                    INSERT INTO employees (first_name, last_name, email)
                    VALUES (?, ?, ?)
                `;
                const employeeParams = [
                    employeeData.first_name,
                    employeeData.last_name,
                    employeeData.email
                ];
                const [employeeResult] = await connection.query(insertEmployeeSql, employeeParams);

                const employeeId = employeeResult.insertId;

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
                await connection.query(insertServiceAssignmentSql, serviceParams);

                await connection.commit();

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
                await connection.rollback();
                console.error('Error adding new employee and service assignment:', error);
                throw error;
            } finally {
                connection.release();
            }
        },


        updateEmployee: async (employeeId, updateData) => {
            try {
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
        
                await db.query(updateEmployeeSql, employeeParams);
        
                return { message: "Employee information updated successfully" };
            } catch (error) {
                console.error('Error updating employee information:', error);
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
        },
        getRandomEmployeeForService: async (service_id) => {
            const sql = `
                SELECT e.employee_id 
                FROM employees e
                JOIN service_assignments sa ON e.employee_id = sa.employee_id
                WHERE sa.service_id = ? 
                ORDER BY RAND() 
                LIMIT 1
            `;
            const employees = await db.query(sql, [service_id]);
            return employees[0]; 
        },
        findEmployeeByDetails: async (first_name, last_name, email) => {
            const sql = 'SELECT * FROM employees WHERE first_name = ? AND last_name = ? AND email = ?';
            const employees = await db.query(sql, [first_name, last_name, email]);
            return employees[0];
        },
        findEmployeesWithServices: async (serviceId) => {
            const sql = `
                SELECT e.employee_id, e.first_name, e.last_name, e.email,s.service_name
                FROM employees e
                JOIN service_assignments sa ON e.employee_id = sa.employee_id
                JOIN services s ON sa.service_id = s.service_id
                WHERE s.service_id = ? 
                ORDER BY e.employee_id;
            `;
            const employeesWithServices = await db.query(sql, [serviceId]);
            return employeesWithServices;
        }   
    };

    return Employee;
}
