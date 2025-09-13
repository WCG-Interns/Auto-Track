const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getPendingUsers = async (req, res) => {
  try{
    const users = await User.find({isApproved: false}).select("_id name email createdAt");
    res.json(users);
  } catch(err) {
    console.log("Error fetching pending users:", err);
    res.status(500).json({message: "Server error while fetching pending users"});
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User approved successfully", user });
  } catch (err) {
    console.error("Error approving user:", err);
    res.status(500).json({ message: "Server error while approving user" });
  }
};

exports.approveAllUsers = async (req, res) => {
  try {
    const result = await User.updateMany(
      { isApproved: false },
      { $set: { isApproved: true } }
    );

    res.json({
      message: `${result.modifiedCount} users approved successfully`
    });
  } catch (err) {
    console.error("Error approving all users:", err);
    res.status(500).json({ message: "Server error while approving all users" });
  }
};
