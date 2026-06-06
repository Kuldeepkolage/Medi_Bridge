import Activity from "../models/Activity.model.js";

export const getMyActivity = async (req, res) => {
  try {
    const activities = await Activity.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};