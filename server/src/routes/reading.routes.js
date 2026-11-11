const express = require("express");

const  authenticate  = require("../middleware/auth.middleware");

const {
    createReading,
    getReadings,
    getReadingById,
    updateReading,
    deleteReading
} = require("../controllers/reading.controller");

const {
    readingValidation,
    validateReadingId,
    validateRequest
} = require("../validators/reading.validator");

const router = express.Router();

// All reading routes require authentication
router.use(authenticate);

// GET all readings
router.get("/", getReadings);

// CREATE reading
router.post(
    "/",
    readingValidation,
    validateRequest,
    createReading
);

// GET one reading
router.get(
    "/:id",
    validateReadingId,
    validateRequest,
    getReadingById
);

// UPDATE reading
router.put(
    "/:id",
    validateReadingId,
    readingValidation,
    validateRequest,
    updateReading
);

// DELETE reading
router.delete(
    "/:id",
    validateReadingId,
    validateRequest,
    deleteReading
);

module.exports = router;