import IssueService from '../services/Issues.service.js';

const IssuesController = {
    async createIssue(req, res) {
        const { id: employee_id, role } = req.user;  
        
        const { developer_id, issue, issue_description, status } = req.body;

        try {
            const issueData = {
                employee_id: employee_id,
                developer_id: developer_id,
                issue,
                issue_description,
                status: status
            };

            const result = await IssueService.createIssue(issueData, role); 

            if (result.error) {
                return res.status(500).json({ error: result.error });
            }

            return res.status(201).json({
                message: 'Issue created successfully',
                issue: result
            });
        } catch (error) {
            console.error('Error in createIssue:', error.message);
            return res.status(500).json({ error: 'Failed to create issue' });
        }
    }
};

export default IssuesController;
