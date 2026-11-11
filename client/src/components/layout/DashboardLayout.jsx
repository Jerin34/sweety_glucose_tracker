
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    FaHeartPulse,
    FaGauge,
    FaDroplet,
    FaChartLine,
    FaRightFromBracket
} from "react-icons/fa6";

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const navigation = [
        { label: "Dashboard", path: "/dashboard", icon: <FaGauge /> },
        { label: "Readings", path: "/readings", icon: <FaDroplet /> },
        { label: "Reports", path: "/reports", icon: <FaChartLine /> }
    ];

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <FaHeartPulse />
                    <span>Sweety</span>
                </div>

                <p className="sidebar-label">MAIN MENU</p>

                <nav className="sidebar-nav">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/dashboard"}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <div className="user-profile">
                        <div className="user-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="user-info">
                            <strong>{user?.name || "User"}</strong>
                            <small>{user?.email || ""}</small>
                        </div>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <FaRightFromBracket />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div>
                        <h5 className="mb-0">Blood Glucose Tracker</h5>
                        <small className="text-muted">
                            Monitor your glucose readings
                        </small>
                    </div>
                    <div className="topbar-brand">
                        <FaHeartPulse />
                        Sweety
                    </div>
                </header>

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
