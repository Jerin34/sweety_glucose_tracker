
import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import api from "../../services/api";
import { FaDroplet, FaArrowTrendUp, FaArrowTrendDown, FaGauge } from "react-icons/fa6";

const DashboardPage = () => {
    const [report, setReport] = useState(null);
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [reportResponse, readingsResponse] = await Promise.all([
                    api.get("/reports/month-to-date"),
                    api.get("/readings")
                ]);

                setReport(reportResponse.data.report);

                const data = readingsResponse.data;

                const readingList = Array.isArray(data)
                    ? data
                    : data.readings || data.data || [];

                setReadings(readingList);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
        });
    };

    const chartData = [...readings]
        .sort((a, b) => new Date(a.reading_date) - new Date(b.reading_date))
        .slice(-10)
        .map((reading) => ({
            date: formatDate(reading.reading_date),
            glucose: reading.glucose_value
        }));

    const stats = [
        {
            title: "Total Readings",
            value: report?.total_readings ?? 0,
            icon: <FaDroplet />,
            color: "purple"
        },
        {
            title: "Average Glucose",
            value: report?.average ?? "—",
            unit: "mg/dL",
            icon: <FaGauge />,
            color: "blue"
        },
        {
            title: "Highest Reading",
            value: report?.highest ?? "—",
            unit: "mg/dL",
            icon: <FaArrowTrendUp />,
            color: "orange"
        },
        {
            title: "Lowest Reading",
            value: report?.lowest ?? "—",
            unit: "mg/dL",
            icon: <FaArrowTrendDown />,
            color: "green"
        }
    ];

    if (loading) {
        return <div className="loading-state">Loading your dashboard...</div>;
    }

    return (
        <div>
            <div className="dashboard-heading">
                <div>
                    <h2>Dashboard</h2>
                    <p>Here's your glucose overview for this month.</p>
                </div>
                <span className="date-badge">
                    {new Date().toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    })}
                </span>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <div className="stats-grid">
                {stats.map((stat) => (
                    <div className="stat-card" key={stat.title}>
                        <div className={`stat-icon ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p>{stat.title}</p>
                            <h3>
                                {stat.value}
                                {stat.unit && (
                                    <small> {stat.unit}</small>
                                )}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <section className="content-card chart-card">
                    <div className="section-heading">
                        <div>
                            <h5>Glucose Trend</h5>
                            <p>Recent readings</p>
                        </div>
                        <span className="chart-unit">mg/dL</span>
                    </div>

                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="glucose"
                                    stroke="#7453d6"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state">
                            No glucose readings available yet.
                        </div>
                    )}
                </section>

                <section className="content-card recent-card">
                    <div className="section-heading">
                        <div>
                            <h5>Recent Readings</h5>
                            <p>Your latest measurements</p>
                        </div>
                    </div>

                    {readings.length > 0 ? (
                        <div className="recent-list">
                            {[...readings]
                                .sort((a, b) =>
                                    new Date(b.reading_date) -
                                    new Date(a.reading_date)
                                )
                                .slice(0, 5)
                                .map((reading) => (
                                    <div className="recent-item" key={reading.id}>
                                        <div>
                                            <strong>
                                                {reading.time_slot.replaceAll("_", " ")}
                                            </strong>
                                            <small>
                                                {formatDate(reading.reading_date)}
                                            </small>
                                        </div>
                                        <span className="reading-value">
                                            {reading.glucose_value}
                                            <small> mg/dL</small>
                                        </span>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            No readings recorded yet.
                        </div>
                    )}
                </section>
            </div>

            <p className="dashboard-note">
                Glucose values are displayed for tracking purposes. Consult a
                healthcare professional for interpretation of your results.
            </p>
        </div>
    );
};

export default DashboardPage;
