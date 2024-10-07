import { Sequelize } from 'sequelize';
import SignUpModel from './models/User.model.js';
import PetModel from './models/Pet.model.js';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    dialect: process.env.DB_DIALECT,
    logging: false,
    pool: {
        max: parseInt(process.env.DB_MAX_POOL, 10),
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        if (process.env.DATABASE_SYNC === 'true') {
            await sequelize.sync({ alter: true, drop: false });
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Initialize models
const db = {};
db.sequelize = sequelize;
db.User = SignUpModel(sequelize, Sequelize);
db.Pet = PetModel(sequelize, Sequelize);

// Automatically associate models
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

export default db;
