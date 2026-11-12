const { pool } = require("../config/db");

// CREATE reading
const createReading = async (userId, reading) => {
    const { reading_date, time_slot, glucose_value } = reading;

    const result = await pool.query(
        `INSERT INTO readings
         (user_id, reading_date, time_slot, glucose_value)
         VALUES ($1, $2, $3, $4)
         RETURNING
            id,
            user_id,
            reading_date::text AS reading_date,
            time_slot,
            glucose_value,
            created_at,
            updated_at`,
        [userId, reading_date, time_slot, glucose_value]
    );

    return result.rows[0];
};
// GET all readings
const getReadings = async (userId) => {
    const result = await pool.query(
        `SELECT id, reading_date::text AS reading_date,
       time_slot, glucose_value, created_at, updated_at
         FROM readings
         WHERE user_id = $1
         ORDER BY reading_date DESC, created_at DESC`,
        [userId]
    );

    return result.rows;
};

// GET single reading
const getReadingById = async (userId, readingId) => {
    const result = await pool.query(
        `SELECT id, user_id, reading_date::text AS reading_date,
       time_slot, glucose_value, created_at, updated_at
FROM readings
         WHERE id = $1 AND user_id = $2`,
        [readingId, userId]
    );

    return result.rows[0];
};

// UPDATE reading
const updateReading = async (userId, readingId, reading) => {
    const { reading_date, time_slot, glucose_value } = reading;

    const result = await pool.query(
        `UPDATE readings
         SET reading_date = $1,
             time_slot = $2,
             glucose_value = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 AND user_id = $5
         RETURNING 
          id, user_id, reading_date::text AS reading_date,
          time_slot, glucose_value, created_at, updated_at
         `,
        [
            reading_date,
            time_slot,
            glucose_value,
            readingId,
            userId
        ]
    );

    return result.rows[0];
};

// DELETE reading
const deleteReading = async (userId, readingId) => {
    const result = await pool.query(
        `DELETE FROM readings
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [readingId, userId]
    );

    return result.rows[0];
};

module.exports = {
    createReading,
    getReadings,
    getReadingById,
    updateReading,
    deleteReading
};