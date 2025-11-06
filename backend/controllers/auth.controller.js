import User from "../models/User.model.js";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;
    if (!fullName || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({ fullName, email, username, password });
    await user.save();
    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;
    res.status(201).json({ message: "User registered successfully", user: userData });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if ((!email && !username) || !password) {
      return res.status(400).json({ message: "Email/Username and password are required" });
    }
    const user = email
      ? await User.findOne({ email })
      : await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.checkPassword(password)) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      message: "User logged in successfully",
      user: { ...user.toObject(), password: undefined, refreshToken: undefined },
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};
