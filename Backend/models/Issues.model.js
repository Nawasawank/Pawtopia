import db from '../database.js';

const Issue = {
    async createIssue(issueData, role) {
        try {
            const sql = `
                INSERT INTO issues (employee_id, developer_id, issue, issue_description, status)
                VALUES (?, ?, ?, ?, ?)
            `;
            const params = [
                issueData.employee_id,
                issueData.developer_id,
                issueData.issue,
                issueData.issue_description,
                issueData.status || 'in_progress',
            ];

            const result = await db.query(sql, params, role);  // Pass role to db.query
            return {
                issue_id: result.insertId,
                ...issueData,
            };
        } catch (error) {
            console.error('Error creating issue:', error);
            throw error;
        }
    },

    async updateIssue(issueId, updateData, role) {
        try {
            const sql = `
                UPDATE issues 
                SET employee_id = ?, developer_id = ?, issue = ?, issue_description = ?, status = ?
                WHERE issue_id = ?
            `;
            const params = [
                updateData.employee_id || null,
                updateData.developer_id || null,
                updateData.issue,
                updateData.issue_description,
                updateData.status || 'in_progress',
                issueId,
            ];

            const result = await db.query(sql, params, role);  // Pass role to db.query
            return result;
        } catch (error) {
            console.error('Error updating issue:', error);
            throw error;
        }
    },

    async findIssueById(issueId, role) {
        try {
            const sql = 'SELECT * FROM issues WHERE issue_id = ?';
            const issues = await db.query(sql, [issueId], role);  // Pass role to db.query
            return issues[0];
        } catch (error) {
            console.error('Error finding issue by ID:', error);
            throw error;
        }
    },

    async findIssuesByDeveloper(developerId, role) {
        try {
            const sql = 'SELECT * FROM issues WHERE developer_id = ?';
            return await db.query(sql, [developerId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error finding issues by developer:', error);
            throw error;
        }
    },

    async findIssuesByAdmin(adminId, role) {
        try {
            const sql = 'SELECT * FROM issues WHERE employee_id = ?';
            return await db.query(sql, [adminId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error finding issues by admin:', error);
            throw error;
        }
    },

    async deleteIssue(issueId, role) {
        try {
            const sql = 'DELETE FROM issues WHERE issue_id = ?';
            return await db.query(sql, [issueId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error deleting issue:', error);
            throw error;
        }
    },

    async getAllIssues(role) {
        try {
            const sql = 'SELECT * FROM issues';
            return await db.query(sql, [], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error retrieving all issues:', error);
            throw error;
        }
    },
};

export default Issue;
