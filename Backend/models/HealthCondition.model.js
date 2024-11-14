import db from '../database.js';

const HealthCondition = {
    async addHealthCondition(healthConditionData, role) {
        try {
            const sql = `
                INSERT INTO health_conditions (health_condition)
                VALUES (?)
            `;
            const params = [healthConditionData.health_condition];
            const result = await db.query(sql, params, role);  // Pass role to db.query
            return {
                health_condition_id: result.insertId,
                ...healthConditionData,
            };
        } catch (error) {
            console.error('Error adding health condition:', error);
            throw error;
        }
    },

    async updateHealthCondition(healthConditionId, newHealthCondition, role) {
        try {
            const sql = `
                UPDATE health_conditions 
                SET health_condition = ?
                WHERE health_condition_id = ?
            `;
            const params = [newHealthCondition, healthConditionId];
            const result = await db.query(sql, params, role);  // Pass role to db.query
            return result;
        } catch (error) {
            console.error('Error updating health condition:', error);
            throw error;
        }
    },

    async getHealthConditionById(healthConditionId, role) {
        try {
            const sql = `
                SELECT * 
                FROM health_conditions
                WHERE health_condition_id = ?
            `;
            const conditions = await db.query(sql, [healthConditionId], role);  // Pass role to db.query
            return conditions[0];
        } catch (error) {
            console.error('Error retrieving health condition by ID:', error);
            throw error;
        }
    },

    async getAllHealthConditions(role) {
        try {
            const sql = `
                SELECT * 
                FROM health_conditions
            `;
            const conditions = await db.query(sql, [], role);  // Pass role to db.query
            return conditions;
        } catch (error) {
            console.error('Error retrieving all health conditions:', error);
            throw error;
        }
    },

    async deleteHealthCondition(healthConditionId, role) {
        try {
            const sql = `
                DELETE FROM health_conditions 
                WHERE health_condition_id = ?
            `;
            return await db.query(sql, [healthConditionId], role);  // Pass role to db.query
        } catch (error) {
            console.error('Error deleting health condition:', error);
            throw error;
        }
    },
};

export default HealthCondition;
