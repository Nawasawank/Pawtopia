export default function ServiceAssignmentsModel(db) {
    const ServiceAssignment = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS service_assignments (
                    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
                    employee_id INT,
                    service_id INT,
                    assignment_date DATE,
                    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
                    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
                );
            `;
            await db.query(sql);
        },

        async assignService(assignmentData) {
            try {
                const sql = `
                    INSERT INTO service_assignments (employee_id, service_id, assignment_date) 
                    VALUES (?, ?, ?)
                `;
                const params = [
                    assignmentData.employee_id,
                    assignmentData.service_id,
                    assignmentData.assignment_date
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error assigning service:', error);
                throw error;
            }
        },

        async findAssignmentsByEmployeeId(employeeId) {
            const sql = `
                SELECT s.service_name, sa.assignment_date
                FROM service_assignments sa
                JOIN services s ON sa.service_id = s.service_id
                WHERE sa.employee_id = ?
            `;
            return db.query(sql, [employeeId]);
        },

        async deleteAssignment(assignmentId) {
            const sql = 'DELETE FROM service_assignments WHERE assignment_id = ?';
            return db.query(sql, [assignmentId]);
        }
    };

    return ServiceAssignment;
}
