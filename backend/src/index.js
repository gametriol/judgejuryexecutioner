require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Score = require('./models/Score');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flux';
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Get points by rollNo
// Use a prefixed path to avoid conflicts with fixed routes like /api/points/all
app.get('/api/points/roll/:rollNo', async (req, res) => {
  const { rollNo } = req.params;
  try {
    const doc = await Score.findOne({ rollNo });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    return res.json({ rollNo: doc.rollNo, points: doc.points });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Add points for a rollNo (sum)
// Body: { rollNo: string, points: number }
app.post('/api/points/add', async (req, res) => {
  const { rollNo, points } = req.body;
  if (!rollNo || typeof points !== 'number') return res.status(400).json({ message: 'rollNo and numeric points required' });

  try {
    const updated = await Score.findOneAndUpdate(
      { rollNo },
      { $inc: { points } },
      { upsert: true, new: true }
    );
    return res.json({ rollNo: updated.rollNo, points: updated.points });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Seed endpoint: create score docs for rollNos found in provided JSON file
app.post('/api/seed/from-applications', async (req, res) => {
  try {
    const filePath = path.resolve(__dirname, '../../test.applications.json');
    const data = require(filePath);
    const rollNos = data.map(a => a.rollNo).filter(Boolean);
    const ops = rollNos.map(r => ({ updateOne: { filter: { rollNo: r }, update: { $setOnInsert: { rollNo: r, points: 0 } }, upsert: true } }));
    if (ops.length) await Score.bulkWrite(ops);
    return res.json({ created: ops.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Seeder failed' });
  }
});

// Get top N scores (leaderboard)
// Query param: ?limit=10
app.get('/api/points/top', async (req, res) => {
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
  try {
    const docs = await Score.find({}).sort({ points: -1 }).limit(limit).lean();
    return res.json(docs.map(d => ({ rollNo: d.rollNo, points: d.points })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all scores (full leaderboard) sorted desc
app.get('/api/points/all', async (req, res) => {
  try {
    const docs = await Score.find({}).sort({ points: -1 }).lean();
    return res.json(docs.map(d => ({ rollNo: d.rollNo, points: d.points })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});
app.get(['/healthz', '/health'], (req, res) => {
  res.status(200).json({ status: 'ok' });
});


// Get all scores merged with application details from local test JSON
// Returns array sorted by points desc: { rollNo, points, name, branch, imageUrl, ... }
app.get('/api/points/all-with-details', async (req, res) => {
  try {
    const filePath = path.resolve(__dirname, '../../test.applications.json');
    const apps = require(filePath);
    const docs = await Score.find({}).lean();
    const scoreMap = new Map(docs.map(d => [d.rollNo, d.points]));

    const merged = apps.map(a => ({
      rollNo: a.rollNo,
      points: scoreMap.get(a.rollNo) || 0,
      name: a.name || null,
      branch: a.branch || null,
      imageUrl: a.imageUrl || null,
      // include any other useful fields from the application object
      application: a
    }));

    merged.sort((x, y) => (y.points || 0) - (x.points || 0));
    return res.json(merged);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Paginated list of scores: ?page=1&limit=100
app.get('/api/points', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit, 10) || 100));
  try {
    const docs = await Score.find({}).sort({ points: -1 }).skip((page - 1) * limit).limit(limit).lean();
    return res.json(docs.map(d => ({ rollNo: d.rollNo, points: d.points })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

const http = require('http');
const server = http.createServer(app);

function startServer(port, attempts = 0) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempts < 5) {
      console.warn(`Port ${port} in use, trying ${port + 1}...`);
      setTimeout(() => startServer(port + 1, attempts + 1), 500);
      return;
    }
    console.error('Server error', err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log('Server running on port', port);
  });
}

startServer(Number(process.env.PORT || PORT));
