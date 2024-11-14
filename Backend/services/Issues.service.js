import Issue from "../models/Issues.model.js";

const IssueService = {
    async createIssue(issueData, role) {
        try {
            const result = await Issue.createIssue(issueData, role);  // Pass role to model method
            return {
                message: 'Issue created successfully',
                issueId: result.insertId,  // Assuming `insertId` contains the new issue's ID
                ...issueData,
            };
        } catch (error) {
            console.error('Error in IssueService.createIssue:', error);
            return { error: 'Failed to create issue' };
        }
    }
};

export default IssueService;
