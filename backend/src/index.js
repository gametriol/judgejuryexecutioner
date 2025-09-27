require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Score = require('./models/Score');
const path = require('path');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

// Env vars
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flux';
const PORT = process.env.PORT || 4000;

// Connect Mongo
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

// --- Routes ---

// Health
app.get(['/api/health', '/healthz', '/health'], (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Get points by rollNo
app.get('/api/points/roll/:rollNo', async (req, res) => {
  try {
    const doc = await Score.findOne({ rollNo: req.params.rollNo });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json({ rollNo: doc.rollNo, points: doc.points });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add points
app.post('/api/points/add', async (req, res) => {
  const { rollNo, points } = req.body;
  if (!rollNo || typeof points !== 'number') {
    return res.status(400).json({ message: 'rollNo and numeric points required' });
  }

  try {
    const updated = await Score.findOneAndUpdate(
      { rollNo },
      { $inc: { points } },
      { upsert: true, new: true }
    );
    res.json({ rollNo: updated.rollNo, points: updated.points });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed from local JSON
app.post('/api/seed/from-applications', async (req, res) => {
  try {
    const data = require('./test.applications.json');
    const rollNos = data.map(a => a.rollNo).filter(Boolean);

    const ops = rollNos.map(r => ({
      updateOne: {
        filter: { rollNo: r },
        update: { $setOnInsert: { rollNo: r, points: 0 } },
        upsert: true
      }
    }));

    if (ops.length) await Score.bulkWrite(ops);
    res.json({ created: ops.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Seeder failed' });
  }
});

// Leaderboard endpoints
app.get('/api/points/top', async (req, res) => {
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
  try {
    const docs = await Score.find({}).sort({ points: -1 }).limit(limit).lean();
    res.json(docs.map(d => ({ rollNo: d.rollNo, points: d.points })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/points/all', async (req, res) => {
  try {
    const docs = await Score.find({}).sort({ points: -1 }).lean();
    res.json(docs.map(d => ({ rollNo: d.rollNo, points: d.points })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/points/all-with-details', async (req, res) => {
  try {
    const apps = require('./test.applications.json');
    const docs = await Score.find({}).lean();
    const scoreMap = new Map(docs.map(d => [d.rollNo, d.points]));

    const merged = apps.map(a => ({
      rollNo: a.rollNo,
      points: scoreMap.get(a.rollNo) || 0,
      name: a.name || null,
      branch: a.branch || null,
      imageUrl: a.imageUrl || null,
      application: a
    }));

    merged.sort((x, y) => (y.points || 0) - (x.points || 0));
    res.json(merged);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/points', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit, 10) || 100));
  try {
    const docs = await Score.find({}).sort({ points: -1 }).skip((page - 1) * limit).limit(limit).lean();
    res.json(docs.map(d => ({ rollNo: d.rollNo, points: d.points })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Start server ---
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
