
const pool = require("../config/db");

// Get today's date in the configured application timezone.
const getToday = () => {
    const timezone = process.env.APP_TIME_ZONE || "Asia/Kolkata";

    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const dateParts = Object.fromEntries(
        parts.map(({ type, value }) => [type, value])
    );

    return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
};

// Add or subtract calendar days without local timezone issues.
const addDays = (dateString, days) => {
    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date(Date.UTC(year, month - 1, day + days));

    return date.toISOString().slice(0, 10);
};

// Calculate summary statistics for a date range.
const getSummary = async (userId, startDate, endDate) => {
    const result = await pool.query(
        `SELECT
            MAX(glucose_value) AS highest,
            MIN(glucose_value) AS lowest,
            ROUND(AVG(glucose_value)::numeric, 1) AS average,
            COUNT(*)::int AS total_readings
         FROM readings
         WHERE user_id = $1
         AND reading_date >= $2::date
         AND reading_date < $3::date`,
        [userId, startDate, endDate]
    );

    const row = result.rows[0];

    return {
        highest: row.highest,
        lowest: row.lowest,
        average: row.average,
        total_readings: row.total_readings
    };
};

// DAILY REPORT
const getDailyReport = async (userId, date) => {
    const summary = await getSummary(
        userId,
        date,
        addDays(date, 1)
    );

    const result = await pool.query(
        `SELECT
            id,
            reading_date,
            time_slot,
            glucose_value,
            created_at,
            updated_at
         FROM readings
         WHERE user_id = $1
         AND reading_date = $2::date
         ORDER BY
            CASE time_slot
                WHEN 'morning' THEN 1
                WHEN 'after_breakfast' THEN 2
                WHEN 'after_lunch' THEN 3
                WHEN 'after_dinner' THEN 4
            END`,
        [userId, date]
    );

    return {
        date,
        ...summary,
        readings: result.rows
    };
};

// MONTH-TO-DATE REPORT
const getMonthToDateReport = async (userId) => {
    const today = getToday();

    const startDate = `${today.slice(0, 7)}-01`;
    const endDate = addDays(today, 1);

    const summary = await getSummary(
        userId,
        startDate,
        endDate
    );

    return {
        start_date: startDate,
        end_date: today,
        ...summary
    };
};

// PREVIOUS MONTH REPORT
const getPreviousMonthReport = async (userId) => {
    const today = getToday();

    const currentMonthStart = `${today.slice(0, 7)}-01`;

    const previousMonthEnd = addDays(currentMonthStart, -1);

    const previousMonthStart =
        `${previousMonthEnd.slice(0, 7)}-01`;

    const summary = await getSummary(
        userId,
        previousMonthStart,
        currentMonthStart
    );

    return {
        start_date: previousMonthStart,
        end_date: previousMonthEnd,
        ...summary
    };
};

module.exports = {
    getDailyReport,
    getMonthToDateReport,
    getPreviousMonthReport
};
