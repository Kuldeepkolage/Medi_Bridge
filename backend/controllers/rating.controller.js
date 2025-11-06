import Rating from "../models/Rating.model.js";

export async function createRating(req, res) {
  try {
    const rating = new Rating(req.body);
    await rating.save();
    res.status(201).json({ success: true, message: "Rating submitted!", data: rating });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error submitting rating", error: err.message });
  }
}

export async function getRatings(req, res) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.json({ success: true, data: ratings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching ratings" });
  }
}
