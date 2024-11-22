import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const getRole = (role) => {
    return role || 'user'; 
};

const createPool = (dbUser, dbPassword) => {
    return mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        user: dbUser,
        password: dbPassword,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: parseInt(process.env.DB_MAX_POOL, 10),
        queueLimit: 0,
    });
};

const pools = {
    admin: createPool(process.env.DB_ADMIN_USER, process.env.DB_ADMIN_PASS),
    developer: createPool(process.env.DB_DEVELOPER_USER, process.env.DB_DEVELOPER_PASS),
    user: createPool(process.env.DB_USER, process.env.DB_PASS),
    default: createPool(process.env.DB_DEFAULT_USER, process.env.DB_DEFAULT_PASS),
};

const getPool = (role) => {
    const roleToUse = getRole(role);  
    if (roleToUse && pools[roleToUse]) {
        console.log("Using pool for role:", roleToUse);
        return pools[roleToUse];  
    }

    console.warn("Invalid role provided, defaulting to 'user' pool");
    return pools.user;  
};

const db = {
    query: async (sql, params, role) => {
        if (!role) {
            throw new Error('Role must be provided');
        }
        const pool = getPool(role);  
        const [results] = await pool.execute(sql, params); 
        return results;
    },
};

export { getPool, db, getRole };
export default db;
