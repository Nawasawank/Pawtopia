export default function IssueModel(db) {
    const Issue = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS issues (
                    issue_id INT AUTO_INCREMENT PRIMARY KEY,
                    employee_id INT,
                    developer_id INT,
                    issue VARCHAR(255) NOT NULL,
                    issue_description TEXT,
                    status ENUM('in_progress', 'resolved') DEFAULT 'in_progress',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (employee_id) REFERENCES emp_admins(employee_id) ON DELETE CASCADE,
                    FOREIGN KEY (developer_id) REFERENCES developers(developer_id) ON DELETE CASCADE
                );
            `;
            await db.query(sql);
        },

        async createIssue(issueData) {
            try {
                const sql = `
                    INSERT INTO issues (employee_id, developer_id, issue, issue_description, status)
                    VALUES (?, ?, ?, ?, ?)
                `;
                const params = [
                    issueData.admin_id,
                    issueData.developer_id ,
                    issueData.issue,
                    issueData.issue_description,
                    issueData.status || 'open'
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error creating issue:', error);
                throw error;
            }
        },

        async updateIssue(issueId, updateData) {
            try {
                const sql = `
                    UPDATE issues 
                    SET employee = ?, developer_id = ?, issue = ?, issue_description = ?, status = ?
                    WHERE issue_id = ?
                `;
                const params = [
                    updateData.employee_id || null,
                    updateData.developer_id || null,
                    updateData.issue,
                    updateData.issue_description,
                    updateData.status || 'open',
                    issueId
                ];

                const result = await db.query(sql, params);
                return result;
            } catch (error) {
                console.error('Error updating issue:', error);
                throw error;
            }
        },

        async findIssueById(issueId) {
            const sql = 'SELECT * FROM issues WHERE issue_id = ?';
            const issues = await db.query(sql, [issueId]);
            return issues[0];
        },

        async findIssuesByDeveloper(developerId) {
            const sql = 'SELECT * FROM issues WHERE developer_id = ?';
            return db.query(sql, [developerId]);
        },

        async findIssuesByAdmin(adminId) {
            const sql = 'SELECT * FROM issues WHERE admin_id = ?';
            return db.query(sql, [adminId]);
        },

        async deleteIssue(issueId) {
            const sql = 'DELETE FROM issues WHERE issue_id = ?';
            return db.query(sql, [issueId]);
        }
    };

    return Issue;
}
