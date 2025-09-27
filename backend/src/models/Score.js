const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  // list of usernames who have rated this candidate
  raters: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Score', ScoreSchema);
