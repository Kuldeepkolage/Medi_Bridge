import React, { useState, useEffect } from "react";
function RatingFeedback() {
  const [form, setForm] = useState({ stars: 5, comment: "" });
  const [msg, setMsg] = useState("");
  const [ratings, setRatings] = useState([]);
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
  return (
    <div className="card">
      <h2>Ratings & Feedback</h2>
      <form onSubmit={handleSubmit}>
        <select name="stars" value={form.stars} onChange={e=>setForm(f=>({...f, stars:e.target.value}))}>
          <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
          <option value={4}>⭐⭐⭐⭐ - Good</option>
          <option value={3}>⭐⭐⭐ - Average</option>
          <option value={2}>⭐⭐ - Below Avg</option>
          <option value={1}>⭐ - Poor</option>
        </select>
        <textarea name="comment" value={form.comment} placeholder="Comment here..." required onChange={e=>setForm(f=>({...f, comment:e.target.value}))}/>
        <button type="submit" className="btn">Submit</button>
      </form>
      {msg && <div className="form-success">{msg}</div>}
      <h4 style={{marginTop:30}}>Latest Feedback</h4>
      <ul style={{textAlign:"left"}}>
        {ratings?.slice(0,5).map((r,i) => (
          <li key={i}>
            <b>{Array(Number(r.stars)).fill("⭐").join("")}</b> 
            <span style={{marginLeft:10}}>{r.comment}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default RatingFeedback;
