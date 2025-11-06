import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema({
  stars: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});
const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
