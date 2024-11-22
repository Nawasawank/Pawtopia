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

            const result = await db.query(sql, params, role); // Pass role to db.query
            return {
                issue_id: result.insertId,
                ...issueData,
            };
        } catch (error) {
            console.error('Error creating issue:', error);
            throw error;
        }
    },

    async updateIssueStatus(issueId, status,role) {
        try {
            const sql = `
                UPDATE issues 
                SET status = ?
                WHERE issue_id = ?
            `;
            const params = [status || 'in_progress', issueId];
    
            // Remove 'default' or 'role'
            const result = await db.query(sql, params, role);
    
            console.log('SQL Update Query:', sql, 'Params:', params);
            console.log('SQL Update Result:', result);
    
            if (result.affectedRows === 0) {
                console.warn('No rows updated. Ensure the issue_id exists.');
                return { error: 'No matching issue found to update.' };
            }
    
            return { success: true, affectedRows: result.affectedRows };
        } catch (error) {
            console.error('Error updating issue status:', error);
            throw error;
        }
    },    

    async findIssuesByDate(date, role) {
        try {
            const sql = `
                SELECT * FROM issues WHERE DATE(created_at) = ?
            `;
            const params = [date];
            return await db.query(sql, params, 'default'); // Pass role to db.query
        } catch (error) {
            console.error('Error finding issues by date:', error);
            throw error;
        }
    },

    async findIssuesByDeveloper(developerId, role) {
        try {
            console.log("role--->",role)
            const sql = 'SELECT * FROM issues WHERE developer_id = ?';
            return await db.query(sql, [developerId], 'default'); // Pass role to db.query
        } catch (error) {
            console.error('Error finding issues by developer:', error);
            throw error;
        }
    },

    async findIssuesByAdmin(adminId, role) {
        try {
            const sql = 'SELECT * FROM issues WHERE employee_id = ?';
            return await db.query(sql, [adminId], role); // Pass role to db.query
        } catch (error) {
            console.error('Error finding issues by admin:', error);
            throw error;
        }
    },

    async getAllIssues(role) {
        try {
            const sql = 'SELECT * FROM issues';
            return await db.query(sql, [], role); // Pass role to db.query
        } catch (error) {
            console.error('Error retrieving all issues:', error);
            throw error;
        }
    },
};

export default Issue;
