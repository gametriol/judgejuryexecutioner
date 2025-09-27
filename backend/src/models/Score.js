const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  // list of usernames who have rated this candidate
  raters: { type: [String], default: [] },
  // record of ratings (keeps history of who rated how much)
  ratings: {
    type: [
      {
        rater: { type: String },
        points: { type: Number },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Score', ScoreSchema);
