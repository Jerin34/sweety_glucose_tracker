const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../../.env")
});

const { Pool } = require("pg");


const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const connectDb = async () => {
    try {
        const result = await pool.query("SELECT NOW() AS current_time");

        console.log("PostgreSQL connected successfully!");
        console.log("Database time:", result.rows[0].current_time);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};

module.exports = { pool, connectDb };