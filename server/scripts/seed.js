const bcrypt = require("bcrypt");
const { pool } = require("../src/config/db");
const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const seedDatabase = async () => {
    try {
        const name = "Demo User";
        const email = process.env.SEED_EMAIL;
        const password = process.env.SEED_PASSWORD;
    
        if (!email || !password) {
            throw new Error(
                "Please configure SEED_EMAIL and SEED_PASSWORD in server/.env"
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const userResult = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             ON CONFLICT (email)
             DO UPDATE SET
                name = EXCLUDED.name,
                password = EXCLUDED.password
             RETURNING id`,
            [name, email, hashedPassword]
        );

        const userId = userResult.rows[0].id;

        const readings = [
            ["2026-11-10", "morning", 105],
            ["2026-11-10", "after_breakfast", 145],
            ["2026-11-10", "after_lunch", 130],
            ["2026-11-10", "after_dinner", 120],
        ];

        for (const [date, slot, value] of readings) {
            await pool.query(
                `INSERT INTO readings
                 (user_id, reading_date, time_slot, glucose_value)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (user_id, reading_date, time_slot)
                 DO NOTHING`,
                [userId, date, slot, value]
            );
        }

        console.log("Database seeded successfully!");
        console.log(`Demo account: ${email}`);

    } catch (error) {
        console.error("Database seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

seedDatabase();