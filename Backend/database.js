import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import UserModel from './models/User.model.js'; 
import PetModel from './models/Pet.model.js';  
import HotelBookingModel from './models/Hotel_Service_Booking.model.js';  
import EmployeeModel from './models/Employee.model.js'
import ServiceModel from './models/Service.model.js';
import ServiceAssignmentsModel from './models/ServiceAssignment.model.js';
import OtherServicesBookingModel from './models/OtherService.model.js';

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
const Hotel = HotelBookingModel(db);
const Employee = EmployeeModel(db);
const Service = ServiceModel(db);
const ServiceAssignment = ServiceAssignmentsModel(db);
const OtherService = OtherServicesBookingModel(db);

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connection has been established successfully.');

        await User.createTable();
        await Pet.createTable();
        await Hotel.createTable();
        await Employee.createTable();
        await Service.createTable();
        await ServiceAssignment.createTable();
        await OtherService.createTable();

        connection.release();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

export { User, Pet, Hotel };
export default db;
