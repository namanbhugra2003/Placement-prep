// backend/models/Resume.js

const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true  // ensure one resume per user
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  file: {
    type: String,
    required: true,
    trim: true  // URL to the PDF
  }
}, { timestamps: true });

module.exports = mongoose.model("ResumeModel", resumeSchema);
