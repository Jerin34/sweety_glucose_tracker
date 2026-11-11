
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaHeartPulse } from "react-icons/fa6";

const LoginPage = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(form.email.trim(), form.password);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to login. Please check your credentials."
            );
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="text-center mb-4">
                    <div className="brand-icon">
                        <FaHeartPulse />
                    </div>
                    <h2 className="fw-bold mt-3">Welcome to Sweety</h2>
                    <p className="text-muted">
                        Your health, your numbers, your control.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center mt-4 mb-0">
                    Don't have an account?{" "}
                    <Link to="/register" className="auth-link">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
