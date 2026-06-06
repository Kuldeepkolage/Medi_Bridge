import React, { useState } from "react";
import { userAPI } from "../services/api";

export default function AppointmentBooking() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    service: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const TIME_SLOTS = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  const SERVICES = [
    "General Checkup",
    "Teeth Cleaning",
    "Root Canal",
    "Tooth Extraction",
    "Braces",
    "Emergency Care",
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await userAPI.createAppointment(form);

      if (response.data.success) {
        setMessage("Appointment booked successfully!");

        setForm({
          name: "",
          phone: "",
          date: "",
          time: "",
          service: "",
        });
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Booking failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16">
      <div className="max-w-4xl mx-auto px-4">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            Book Your Appointment
          </h1>
          <p className="text-gray-500 mt-2">
            Quick & easy booking. Our team confirms within 2 hours.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow">

          <h2 className="text-xl font-semibold mb-6">
            Appointment Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              name="phone"
              placeholder="+91 95119 36441"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />

            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Time</option>

              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>

            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Service</option>

              {SERVICES.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>

            {message && (
              <p className="text-center mt-3">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}