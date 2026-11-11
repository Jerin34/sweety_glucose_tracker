
const express = require("express");

const authenticate = require("../middleware/auth.middleware");

const {
    getDaily,
    getMonthToDate,
    getPreviousMonth
} = require("../controllers/reports.controller");

const router = express.Router();

// All report endpoints require authentication.
router.use(authenticate);

router.get("/daily", getDaily);
router.get("/month-to-date", getMonthToDate);
router.get("/previous-month", getPreviousMonth);

module.exports = router;
