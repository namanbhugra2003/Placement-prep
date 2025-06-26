
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  github: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
