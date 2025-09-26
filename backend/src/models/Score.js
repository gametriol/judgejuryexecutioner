const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Score', ScoreSchema);
