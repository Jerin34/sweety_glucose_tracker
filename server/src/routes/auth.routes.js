const express = require("express");

const {
    register,
    login
} = require("../controllers/auth.controller");

const {
    registerValidation,
    loginValidation,
    validateRequest
} = require("../validators/auth.validator");

const router = express.Router();

router.post(
    "/register",
    registerValidation,
    validateRequest,
    register
);

router.post(
    "/login",
    loginValidation,
    validateRequest,
    login
);

module.exports = router;