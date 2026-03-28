import React, { useState, useEffect } from "react";

function RatingFeedback() {
  const [form, setForm] = useState({ stars: 5, comment: "" });
  const [msg, setMsg] = useState("");
  const [ratings, setRatings] = useState([]);

  // ── Logic unchanged ───────────────────────────────────────────────────────
  useEffect(() => {
    fetch("http://localhost:5000/api/ratings")
      .then(res => res.json())
      .then(data => setRatings(data.data));
  }, [msg]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Submitting...");
    try {
      const res = await fetch("http://localhost:5000/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setMsg("Thanks for your feedback!");
      else setMsg("Failed. Try again.");
      setForm({ stars: 5, comment: "" });
    } catch {
      setMsg("Server error. Try later.");
    }
  }

  const starLabels = { 5: "Excellent", 4: "Good", 3: "Average", 2: "Below Average", 1: "Poor" };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Ratings & Feedback</h1>
          <p className="mt-2 text-gray-500">Share your experience to help us improve our services.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Submit Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-6">Leave a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
                <select
                  name="stars" value={form.stars}
                  onChange={e => setForm(f => ({ ...f, stars: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white appearance-none"
                >
                  <option value={5}>★★★★★ — Excellent</option>
                  <option value={4}>★★★★☆ — Good</option>
                  <option value={3}>★★★☆☆ — Average</option>
                  <option value={2}>★★☆☆☆ — Below Average</option>
                  <option value={1}>★☆☆☆☆ — Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Comment</label>
                <textarea
                  name="comment" value={form.comment} placeholder="Tell us about your experience..."
                  required onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>
              <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition-colors duration-200">
                Submit Review
              </button>
            </form>
            {msg && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${
                msg.includes("Thanks") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {msg}
              </div>
            )}
          </div>

          {/* Latest Reviews */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-4">Latest Feedback</h2>
            <div className="space-y-3">
              {ratings?.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
                  No reviews yet. Be the first!
                </div>
              )}
              {ratings?.slice(0, 5).map((r, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, idx) => (
                      <svg key={idx} className={`w-4 h-4 ${idx < Number(r.stars) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">{starLabels[Number(r.stars)]}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RatingFeedback;