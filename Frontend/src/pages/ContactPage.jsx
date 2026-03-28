import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [msg, setMsg] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Sending...");
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setMsg(t("messageSent") || "Message sent!");
      else setMsg(t("messageFailed") || "Failed. Try again.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setMsg(t("serverError") || "Server error. Try later.");
    }
  }

  const inputClass = "w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("contactUs") || "Contact Us"}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {t("contactDesc") || "Get in touch with our team. We'll respond within 2 hours."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-6">
              {t("sendMessage") || "Send a Message"}
            </h2>
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("fullName")}
                </label>
                <input
                  name="name" value={form.name}
                  placeholder="Full name" required onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("emailAddress")}
                </label>
                <input
                  name="email" type="email" value={form.email}
                  placeholder="you@example.com" required onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("yourMessage") || "Your Message"}
                </label>
                <textarea
                  name="message" value={form.message}
                  placeholder="How can we help you?" required onChange={handleChange}
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition-colors duration-200">
                {t("sendMessage") || "Send Message"}
              </button>
            </form>
            {msg && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${
                msg.includes("sent") || msg.includes("भेज") || msg.includes("पाठव")
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
              }`}>
                {msg}
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="space-y-4">

            {/* Location */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {t("clinicAddress") || "Clinic Address"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Maulana Azad Road, Holi Bazaar Gharat Wadi,<br />Vasai West, Maharashtra 401201
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {t("phoneNumber")}
                  </p>
                  <a href="tel:+919511936441"
                    className="text-gray-500 dark:text-gray-400 text-sm mt-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">
                    +91 95119 36441
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {t("workingHours") || "Working Hours"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {t("monSat") || "Mon – Sat"}: 9:00 AM – 8:00 PM<br />
                    {t("sunday") || "Sunday"}: 10:00 AM – 4:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-6">
              <p className="font-semibold text-red-800 dark:text-red-400 text-sm mb-1">
                🚨 {t("dentalEmergency") || "Dental Emergency?"}
              </p>
              <p className="text-red-600 dark:text-red-400 text-xs mb-3">
                {t("emergencyDesc") || "We provide 24/7 emergency dental care."}
              </p>
              <a href="tel:+919511936441"
                className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-center text-sm transition-colors duration-200">
                {t("callEmergencyLine") || "Call Emergency Line"}
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;