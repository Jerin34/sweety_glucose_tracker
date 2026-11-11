const {
    registerUser,
    loginUser
} = require("../services/auth.service");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await registerUser({
            name,
            email,
            password
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            user
        });

    } catch (error) {
        if (error.message === "Email already registered.") {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginUser({
            email,
            password
        });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            ...result
        });

    } catch (error) {
        if (error.message === "Invalid email or password.") {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = {
    register,
    login
};