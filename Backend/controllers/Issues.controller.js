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
    }, async getIssues(req, res) {
        const { date } = req.query;
        const { id: developer_id, role } = req.user;  

        try {
            console.log("role",role)
            let issues;
            if (date) {
                issues = await IssueService.getIssuesByDate(date, role);
            } else if (developer_id) {
                issues = await IssueService.getIssuesByDeveloper(developer_id, role);
            } //else if (employee_id) {
            //     issues = await IssueService.getIssuesByEmployee(employee_id, role);
            // } else {
            //     issues = await IssueService.getAllIssues(role);
            // }

            return res.status(200).json({
                message: 'Issues fetched successfully',
                issues,
            });
        } catch (error) {
            console.error('Error in getIssues:', error.message);
            return res.status(500).json({ error: 'Failed to fetch issues' });
        }
    },

    async updateIssueStatus(req, res) {
        const { id: employee_id } = req.user;
        const { issue_id, status } = req.body;
        const role = 'default'
    
        console.log('Update Request Received:', { issue_id, status });
    
        try {
            const result = await IssueService.updateIssueStatus(issue_id, status, role);
    
            if (result.error) {
                console.error('Error in IssueService.updateIssueStatus:', result.error);
                return res.status(400).json({ error: result.error });
            }
    
            console.log('Update Successful:', result);
            return res.status(200).json({
                message: 'Issue status updated successfully',
                issue_id,
                status,
            });
        } catch (error) {
            console.error('Error in updateIssueStatus controller:', error.message);
            return res.status(500).json({ error: 'Failed to update issue status' });
        }
    }
    
};

export default IssuesController;
