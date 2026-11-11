
const {
    getDailyReport,
    getMonthToDateReport,
    getPreviousMonthReport
} = require("../services/report.service");

const getDaily = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date query parameter is required."
            });
        }

        // Validate YYYY-MM-DD and reject invalid/future dates.
        const [year, month, day] = date.split("-").map(Number);
        const parsed = new Date(Date.UTC(year, month - 1, day));

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            parsed.getUTCFullYear() !== year ||
            parsed.getUTCMonth() !== month - 1 ||
            parsed.getUTCDate() !== day
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid date. Use YYYY-MM-DD."
            });
        }

        const today = new Intl.DateTimeFormat("en-CA", {
            timeZone: process.env.APP_TIME_ZONE || "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(new Date());

        if (date > today) {
            return res.status(400).json({
                success: false,
                message: "Future dates are not allowed."
            });
        }

        const report = await getDailyReport(req.user.id, date);

        return res.status(200).json({
            success: true,
            report
        });

    } catch (error) {
        console.error("Daily report error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate daily report."
        });
    }
};

const getMonthToDate = async (req, res) => {
    try {
        const report = await getMonthToDateReport(req.user.id);

        return res.status(200).json({
            success: true,
            report
        });
    } catch (error) {
        console.error("Month-to-date report error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate month-to-date report."
        });
    }
};

const getPreviousMonth = async (req, res) => {
    try {
        const report = await getPreviousMonthReport(req.user.id);

        return res.status(200).json({
            success: true,
            report
        });
    } catch (error) {
        console.error("Previous-month report error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate previous-month report."
        });
    }
};

module.exports = {
    getDaily,
    getMonthToDate,
    getPreviousMonth
};
