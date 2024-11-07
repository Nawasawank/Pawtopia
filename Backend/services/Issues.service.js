import {Issues} from '../database.js'; // Make sure IssueModel is properly instantiated in database.js

const IssueService = {
    async createIssue(issueData) {
        try {
            const result = await Issues.createIssue(issueData);
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
