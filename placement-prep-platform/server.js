const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth"); // make sure this path matches
require("dotenv").config(); // ✅ Must be called before accessing process.env

const app = express();
const PORT = process.env.PORT || 5000;

// 🔗 MongoDB Connection
mongoose.connect("mongodb://localhost:27017/placementPrep", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// 🌐 Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// 📦 Routes
app.use("/api/auth", authRoutes);

// 🔥 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
