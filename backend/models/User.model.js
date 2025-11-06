import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  refreshToken: { type: String }
}, { timestamps: true });

userSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateAccessToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const User = mongoose.model("User", userSchema);
export default User;
