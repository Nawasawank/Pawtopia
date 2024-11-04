import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import UserModel from './models/User.model.js'; 
import PetModel from './models/Pet.model.js';  
import EmployeeModel from './models/Employee.model.js'
import ServiceModel from './models/Service.model.js';
import ServiceAssignmentsModel from './models/ServiceAssignment.model.js';
import OtherServicesBookingModel from './models/OtherService.model.js';
import CustomerFeedbackModel from './models/CustomerFeedbacks.js';
import AdminModel from './models/Admin.model.js';
import DeveloperModel from './models/Developer.model.js';
import IssueModel from './models/Issues.model.js';
import HealthConditionModel from './models/HealthCondition.model.js';

dotenv.config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_MAX_POOL, 10),
    queueLimit: 0
});

const db = {
    query: async (sql, params) => {
        const [results] = await pool.execute(sql, params);
        return results;
    },
};

const User = UserModel(db);
const Pet = PetModel(db);
const Employee = EmployeeModel(db);
const Service = ServiceModel(db);
const ServiceAssignment = ServiceAssignmentsModel(db);
const OtherService = OtherServicesBookingModel(db);
const CustomerFeedback = CustomerFeedbackModel(db);
const Admin = AdminModel(db);
const Developer = DeveloperModel(db);
const Issues = IssueModel(db);
const Health_Condition = HealthConditionModel(db);

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connection has been established successfully.');

        await User.createTable();
        await Pet.createTable();
        await Employee.createTable();
        await Service.createTable();
        await ServiceAssignment.createTable();
        await OtherService.createTable();
        await CustomerFeedback.createTable();
        await Admin.createTable();
        await Developer.createTable();
        await Issues.createTable();
        await Health_Condition.createTable();

        connection.release();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

export { User, Pet,Employee,Service,ServiceAssignment,OtherService,CustomerFeedback,Admin,Health_Condition,Developer };
export default db;
