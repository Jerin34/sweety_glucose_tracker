
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaHeartPulse } from "react-icons/fa6";

const RegisterPage = () => {
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        try {
            await register(
                form.name.trim(),
                form.email.trim(),
                form.password
            );

            setSuccess("Account created successfully. Redirecting to login...");

            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            const response = err.response?.data;

            const message = response?.errors?.[0]?.msg ||
                response?.message ||
                "Registration failed. Please try again.";

            setError(message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="text-center mb-4">
                    <div className="brand-icon">
                        <FaHeartPulse />
                    </div>
                    <h2 className="fw-bold mt-3">Create your account</h2>
                    <p className="text-muted">
                        Start tracking your glucose with Sweety.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success" role="status">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Full name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control form-control-lg"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            maxLength={100}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control form-control-lg"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control form-control-lg"
                            placeholder="Minimum 8 characters"
                            value={form.password}
                            onChange={handleChange}
                            minLength={8}
                            maxLength={72}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="text-center mt-4 mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
