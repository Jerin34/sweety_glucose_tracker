
import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  reading_date: new Date().toLocaleDateString("en-CA"),
  time_slot: "morning",
  glucose_value: "",
};

const slots = [
  { value: "morning", label: "Morning (Fasting)" },
  { value: "after_breakfast", label: "After Breakfast" },
  { value: "after_lunch", label: "After Lunch" },
  { value: "after_dinner", label: "After Dinner" },
];

function ReadingsPage() {
  const [readings, setReadings] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReadings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/readings");
      const data = response.data;
      setReadings(
        Array.isArray(data)
          ? data
          : data.readings || data.data || []
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load readings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const value = Number(form.glucose_value);

    if (!Number.isInteger(value) || value < 40 || value > 600) {
      setError("Enter a whole number between 40 and 600 mg/dL.");
      return;
    }

    if (form.reading_date > new Date().toLocaleDateString("en-CA")) {
      setError("Future dates are not allowed.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        reading_date: form.reading_date,
        time_slot: form.time_slot,
        glucose_value: value,
      };

      if (editingId) {
        await api.put(`/readings/${editingId}`, payload);
        setSuccess("Reading updated successfully.");
      } else {
        await api.post("/readings", payload);
        setSuccess("Reading added successfully.");
      }

      resetForm();
      await fetchReadings();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Unable to save reading."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (reading) => {
    setEditingId(reading.id);
    setForm({
      reading_date: String(reading.reading_date).slice(0, 10),
      time_slot: reading.time_slot,
      glucose_value: String(reading.glucose_value),
    });
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reading?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await api.delete(`/readings/${id}`);
      setSuccess("Reading deleted successfully.");
      if (editingId === id) resetForm();
      await fetchReadings();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete reading.");
    }
  };

  const getSlotLabel = (value) =>
    slots.find((slot) => slot.value === value)?.label || value;

  return (
    <div className="container-fluid py-3">
      <div className="mb-4">
        <h2 className="fw-bold">Glucose Readings</h2>
        <p className="text-muted">
          Record and manage your daily blood glucose measurements.
        </p>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-4">
        <h5 className="fw-bold mb-3">
          {editingId ? "Edit Reading" : "Add New Reading"}
        </h5>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="reading_date"
                className="form-control"
                value={form.reading_date}
                max={new Date().toLocaleDateString("en-CA")}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Time Slot</label>
              <select
                name="time_slot"
                className="form-select"
                value={form.time_slot}
                onChange={handleChange}
                required
              >
                {slots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Glucose (mg/dL)</label>
              <input
                type="number"
                name="glucose_value"
                className="form-control"
                min="40"
                max="600"
                step="1"
                placeholder="e.g. 110"
                value={form.glucose_value}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Reading" : "Add Reading"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card border-0 shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Reading History</h5>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={fetchReadings}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading readings...</p>
        ) : readings.length === 0 ? (
          <p className="text-muted mb-0">No readings recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Glucose</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((reading) => (
                  <tr key={reading.id}>
                    <td>{String(reading.reading_date).slice(0, 10)}</td>
                    <td>{getSlotLabel(reading.time_slot)}</td>
                    <td className="fw-semibold">
                      {reading.glucose_value} mg/dL
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(reading)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(reading.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReadingsPage;
