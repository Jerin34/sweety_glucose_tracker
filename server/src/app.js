const express = require("express");
const cors = require("cors");

const app = express();

const authroutes = require("./routes/auth.routes");
const readingRoutes = require("./routes/reading.routes");
const reportRoutes = require("./routes/reports.routes");


app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Sweety API is running"
    });
});

app.use("/api/auth", authroutes);
app.use("/api/readings", readingRoutes);
app.use("/api/reports", reportRoutes);



module.exports = app;