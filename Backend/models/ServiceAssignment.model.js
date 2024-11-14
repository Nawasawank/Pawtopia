import db from '../database.js';

const ServiceAssignments = {
    async assignService(assignmentData, role) {
        try {
            const sql = `
                INSERT INTO service_assignments (employee_id, service_id, assignment_date) 
                VALUES (?, ?, ?)
            `;
            const params = [
                assignmentData.employee_id,
                assignmentData.service_id,
                assignmentData.assignment_date || new Date().toISOString().split('T')[0], // Default to current date
            ];

            const result = await db.query(sql, params, role);  // Pass role to db.query
            return await this.findAssignmentById(result.insertId, role); // Return the created assignment
        } catch (error) {
            console.error('Error assigning service:', error);
            throw error;
        }
    },

    async findAssignmentById(assignmentId, role) {
        try {
            const sql = `
                SELECT sa.assignment_id, sa.assignment_date, e.first_name AS employee_name, 
                       s.service_name
                FROM service_assignments sa
                JOIN employees e ON sa.employee_id = e.employee_id
                JOIN services s ON sa.service_id = s.service_id
                WHERE sa.assignment_id = ?
            `;
            const assignments = await db.query(sql, [assignmentId], role);  // Pass role to db.query
            return assignments[0] || null; // Return null if no assignment is found
        } catch (error) {
            console.error('Error finding assignment by ID:', error);
            throw error;
        }
    },

    async findAssignmentsByEmployeeId(employeeId, role) {
        try {
            const sql = `
                SELECT sa.assignment_id, sa.assignment_date, s.service_name
                FROM service_assignments sa
                JOIN services s ON sa.service_id = s.service_id
                WHERE sa.employee_id = ?
            `;
            return await db.query(sql, [employeeId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error finding assignments by employee ID:', error);
            throw error;
        }
    },

    async findAssignmentsByServiceId(serviceId, role) {
        try {
            const sql = `
                SELECT sa.assignment_id, sa.assignment_date, e.first_name AS employee_name
                FROM service_assignments sa
                JOIN employees e ON sa.employee_id = e.employee_id
                WHERE sa.service_id = ?
            `;
            return await db.query(sql, [serviceId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error finding assignments by service ID:', error);
            throw error;
        }
    },

    async deleteAssignment(assignmentId, role) {
        try {
            const sql = 'DELETE FROM service_assignments WHERE assignment_id = ?';
            return await db.query(sql, [assignmentId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error deleting assignment:', error);
            throw error;
        }
    },
};

export default ServiceAssignments;
