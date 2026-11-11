const { body, param, validationResult } = require("express-validator");

const TIME_SLOTS = [
    "morning",
    "after_breakfast",
    "after_lunch",
    "after_dinner"
];

// Get today's date in the configured application timezone
const getToday = () => {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: process.env.APP_TIME_ZONE || "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const values = Object.fromEntries(
        parts.map(part => [part.type, part.value])
    );

    return `${values.year}-${values.month}-${values.day}`;
};

const readingValidation = [
    body("reading_date")
        .isString()
        .withMessage("Date is required.")
        .bail()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Date must be in YYYY-MM-DD format.")
        .bail()
        .custom(value => {
            const date = new Date(`${value}T00:00:00Z`);

            if (
                Number.isNaN(date.getTime()) ||
                date.toISOString().slice(0, 10) !== value
            ) {
                throw new Error("Please provide a valid date.");
            }

            if (value > getToday()) {
                throw new Error("Date cannot be in the future.");
            }

            return true;
        }),

    body("time_slot")
        .isString()
        .withMessage("Time slot is required.")
        .bail()
        .isIn(TIME_SLOTS)
        .withMessage("Please select a valid time slot."),

    body("glucose_value")
        .isInt({ min: 40, max: 600 })
        .withMessage("Value must be between 40 and 600 mg/dl.")
        .toInt()
];

const validateReadingId = [
    param("id")
        .isUUID()
        .withMessage("Invalid reading ID.")
];

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }

    next();
};

module.exports = {
    readingValidation,
    validateReadingId,
    validateRequest
};