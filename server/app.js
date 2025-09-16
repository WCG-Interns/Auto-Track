const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const sendExpiryReminders = require("./utils/sendExpiryReminders");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const emailRoutes = require("./routes/emailRoutes");
const adminRoutes = require("./routes/adminRoutes");
const phoneRoutes = require("./routes/phoneRoutes");
const notifyRoutes = require("./routes/notifyRoutes");


app.use(cors({
  origin: [
    "https://auto-track-client.onrender.com",
    "https://cron-job.org"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.use("/api/admin", adminRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/phones", phoneRoutes);
app.use("/send-reminder", notifyRoutes); // temp route

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// app.get("/reminder", async (req, res) => {
//   try {
//     await sendExpiryReminders();
//     res.status(200).json({ message: "Reminder sent manually" });
//   } catch (err) {
//     res.status(500).json({ message: "Error", error: err.message });
//   }
// });

require("./cron/checkExpiry");

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Connection error:", err);
  });