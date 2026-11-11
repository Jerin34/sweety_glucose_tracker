const { pool } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async ({ name, email, password }) => {

    // Check whether email already exists
    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already registered.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const result = await pool.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at`,
        [name, email, hashedPassword]
    );

    return result.rows[0];
};

const loginUser = async ({ email, password }) => {

    // Find user
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("Invalid email or password.");
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password.");
    }

    // Generate JWT
    const token = jwt.sign(
        {
            userId: user.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    };
};

module.exports = {
    registerUser,
    loginUser
};