const readingService = require("../services/reading.service");

const getDuplicateMessage = (reading) => {
    const slotNames = {
        morning: "Morning (fasting)",
        after_breakfast: "After breakfast",
        after_lunch: "After lunch",
        after_dinner: "After dinner"
    };

    return `You already have a ${slotNames[reading.time_slot]} reading for this date.`;
};

// CREATE
const createReading = async (req, res) => {
    try {
        const reading = await readingService.createReading(
            req.user.id,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Reading added successfully.",
            reading
        });

    } catch (error) {
        
        if (error.code === "23505") {
    return res.status(409).json({
        success: false,
        message: "A reading already exists for this date and time slot."
    });
}

        console.error("Create reading error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add reading."
        });
    }
};

// GET ALL
const getReadings = async (req, res) => {
    try {
        const readings = await readingService.getReadings(req.user.id);

        return res.status(200).json({
            success: true,
            count: readings.length,
            readings
        });

    } catch (error) {
        console.error("Get readings error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve readings."
        });
    }
};

// GET ONE
const getReadingById = async (req, res) => {
    try {
        const reading = await readingService.getReadingById(
            req.user.id,
            req.params.id
        );

        if (!reading) {
            return res.status(404).json({
                success: false,
                message: "Reading not found."
            });
        }

        return res.status(200).json({
            success: true,
            reading
        });

    } catch (error) {
        console.error("Get reading error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve reading."
        });
    }
};

// UPDATE
const updateReading = async (req, res) => {
    try {
        const reading = await readingService.updateReading(
            req.user.id,
            req.params.id,
            req.body
        );

        if (!reading) {
            return res.status(404).json({
                success: false,
                message: "Reading not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reading updated successfully.",
            reading
        });

    } catch (error) {
        if (error.code === "23505") {
    return res.status(409).json({
        success: false,
        message: "A reading already exists for this date and time slot."
    });
}

        console.error("Update reading error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update reading."
        });
    }
};

// DELETE
const deleteReading = async (req, res) => {
    try {
        const deleted = await readingService.deleteReading(
            req.user.id,
            req.params.id
        );

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Reading not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reading deleted successfully."
        });

    } catch (error) {
        console.error("Delete reading error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete reading."
        });
    }
};

module.exports = {
    createReading,
    getReadings,
    getReadingById,
    updateReading,
    deleteReading
};