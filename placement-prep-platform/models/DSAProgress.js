// backend/models/DSAProgress.js
const mongoose = require("mongoose");

const dsaProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  solved: {
    type: [String],
    default: [],
  },
  unsolved: {
    type: [String],
    default: [],
  },

  dailyLog: [
    {
      date: String, // format YYYY-MM-DD
      question: String,
    },
  ]

}, { timestamps: true });

module.exports = mongoose.model("DSAProgress", dsaProgressSchema);
