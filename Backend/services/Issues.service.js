import Issue from '../models/Issues.model.js';

const IssueService = {
    async createIssue(issueData, role) {
        try {
            const result = await Issue.createIssue(issueData, role); // Pass role to model method
            return {
                message: 'Issue created successfully',
                issueId: result.insertId, // Assuming `insertId` contains the new issue's ID
                ...issueData,
            };
        } catch (error) {
            console.error('Error in IssueService.createIssue:', error);
            return { error: 'Failed to create issue' };
        }
    },

    async getAllIssues(role) {
        try {
            return await Issue.getAllIssues(role);
        } catch (error) {
            console.error('Error in IssueService.getAllIssues:', error);
            throw new Error('Failed to fetch all issues');
        }
    },

    async getIssuesByDeveloper(developer_id, role) {
        try {
            return await Issue.findIssuesByDeveloper(developer_id, role);
        } catch (error) {
            console.error('Error in IssueService.getIssuesByDeveloper:', error);
            throw new Error('Failed to fetch issues by developer');
        }
    },

    async getIssuesByEmployee(employee_id, role) {
        try {
            return await Issue.findIssuesByAdmin(employee_id, role);
        } catch (error) {
            console.error('Error in IssueService.getIssuesByEmployee:', error);
            throw new Error('Failed to fetch issues by employee');
        }
    },

    async getIssuesByDate(date, role) {
        try {
            return await Issue.findIssuesByDate(date, role);
        } catch (error) {
            console.error('Error in IssueService.getIssuesByDate:', error);
            throw new Error('Failed to fetch issues by date');
        }
    },

    async updateIssueStatus(issue_id, status, role) {
        console.log('Updating issue status in service:', { issue_id, status });
        try {
            const result = await Issue.updateIssueStatus(issue_id, status,role);
            return result;
        } catch (error) {
            console.error('Error in IssueService.updateIssueStatus:', error);
            return { error: 'Failed to update issue status' };
        }
    }
    
};

export default IssueService;
