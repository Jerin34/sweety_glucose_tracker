
import { useEffect, useState } from "react";
import api from "../../services/api";

function ReportsPage() {
  const [reportType, setReportType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");
      setReport(null);

      let response;

      if (reportType === "daily") {
        response = await api.get("/reports/daily", {
          params: { date: selectedDate },
        });
      } else if (reportType === "month-to-date") {
        response = await api.get("/reports/month-to-date");
      } else {
        response = await api.get("/reports/previous-month");
      }

      setReport(response.data.report || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, selectedDate]);

  const formatValue = (value) =>
    value === null || value === undefined ? "—" : value;

  const stats = report?.statistics || report?.summary || report || {};

  const readings = Array.isArray(report?.readings)
    ? report.readings
    : [];

  return (
    <div className="container-fluid py-3">
      <div className="mb-4">
        <h2 className="fw-bold">Glucose Reports</h2>
        <p className="text-muted">
          Analyze your blood glucose measurements and trends.
        </p>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-4">
        <div className="row align-items-end g-3">
          <div className="col-md-6">
            <label className="form-label">Report Type</label>
            <select
              className="form-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="daily">Daily Report</option>
              <option value="month-to-date">Month-to-Date Report</option>
              <option value="previous-month">Previous Month Report</option>
            </select>
          </div>

          {reportType === "daily" && (
            <div className="col-md-6">
              <label className="form-label">Select Date</label>
              <input
                type="date"
                className="form-control"
                max={new Date().toLocaleDateString("en-CA")}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">Loading report...</div>
      ) : report ? (
        <>
          <div className="row g-3 mb-4">
            {[
              {
                label: "Highest",
                value: stats.highest,
                color: "danger",
              },
              {
                label: "Lowest",
                value: stats.lowest,
                color: "success",
              },
              {
                label: "Average",
                value: stats.average,
                color: "primary",
              },
              {
                label: "Total Readings",
                value: stats.total_readings,
                color: "info",
              },
            ].map((item) => (
              <div className="col-md-3" key={item.label}>
                <div className="card border-0 shadow-sm p-3 h-100">
                  <p className="text-muted mb-2">{item.label}</p>
                  <h3 className={`text-${item.color} fw-bold mb-0`}>
                    {formatValue(item.value)}
                    {item.label !== "Total Readings" &&
                      item.value != null && (
                        <small className="fs-6 ms-1">mg/dL</small>
                      )}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {reportType === "daily" && (
            <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-3">Daily Readings</h5>

              {readings.length === 0 ? (
                <p className="text-muted mb-0">
                  No readings recorded for this date.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Time Slot</th>
                        <th>Glucose Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {readings.map((reading) => (
                        <tr key={reading.id || reading.time_slot}>
                          <td>
                            {reading.time_slot.replaceAll("_", " ")}
                          </td>
                          <td className="fw-semibold">
                            {reading.glucose_value} mg/dL
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default ReportsPage;
