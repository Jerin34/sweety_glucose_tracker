const { body, validationResult } = require("express-validator");

// Registration validation
const registerValidation = [
    body("name")
        .isString()
        .withMessage("Name must be a string.")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ max: 100 })
        .withMessage("Name cannot exceed 100 characters."),

    body("email")
        .isString()
        .withMessage("Email must be a string.")
        .bail()
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email.")
        .isLength({ max: 255 })
        .withMessage("Email is too long.")
        .normalizeEmail(),

    body("password")
        .isString()
        .withMessage("Password must be a string.")
        .bail()
        .isLength({ min: 8 })
        .withMessage("Password must contain at least 8 characters.")
        .custom(value => {
            if (Buffer.byteLength(value, "utf8") > 72) {
                throw new Error("Password cannot exceed 72 bytes.");
            }
            return true;
        })
];

// Login validation
const loginValidation = [
    body("email")
        .isString()
        .withMessage("Email must be a string.")
        .bail()
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email.")
        .normalizeEmail(),

    body("password")
        .isString()
        .withMessage("Password must be a string.")
        .bail()
        .notEmpty()
        .withMessage("Password is required.")
];

// Middleware to handle validation errors
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
    registerValidation,
    loginValidation,
    validateRequest
};