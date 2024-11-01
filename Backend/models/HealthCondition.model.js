export default function HealthConditionModel(db) {
    const HealthCondition = {
        async createTable() {
            const sql = `
                CREATE TABLE IF NOT EXISTS health_conditions (
                health_condition_id INT AUTO_INCREMENT PRIMARY KEY,
                health_condition VARCHAR(255) NOT NULL,
                FOREIGN KEY (health_condition_id) REFERENCES pets(health_condition_id) ON DELETE CASCADE
            );`;
            await db.query(sql);
        },
    };

    return HealthCondition;
}
