// server.js (Node.js with Express)
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = "mongodb+srv://piyushanand:piyushanand404@cluster0.85zrmnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "hackbyte-db";
let db;

async function connectToMongoDB() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("Connected to MongoDB");
}

app.get('/', (req, res) => {
  res.send('Root Route');
});

// Emotion data endpoint
app.post('/api/emotions', async (req, res) => {
  try {
    const result = await db.collection('e_score').insertOne(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save emotion data' });
  }
});

// Add this GET endpoint to fetch emotions data
app.get('/api/emotions', async (req, res) => {
  try {
    // Optional: Add query parameters for filtering
    const limit = parseInt(req.query.limit) || 100; // Default to 100 records
    const sortDirection = req.query.sort === 'desc' ? -1 : 1; // Default to ascending

    const emotions = await db.collection('e_score')
      .find()
      .sort({ captured_at: sortDirection }) // Sort by timestamp
      .limit(limit) // Limit number of records
      .project({
        captured_at: 1,
        happy: 1,
        sad: 1,
        angry: 1,
        surprise: 1,
        fear: 1,
        disgust: 1,
        neutral: 1,
        _id: 0 // Exclude MongoDB _id field
      })
      .toArray();

    res.json(emotions);
  } catch (err) {
    console.error('Error fetching emotions:', err);
    res.status(500).json({ error: 'Failed to fetch emotions data' });
  }
});

// Gaze data endpoint
app.post('/api/gaze', async (req, res) => {
  try {
    const result = await db.collection('gaze_metrics').insertOne(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save gaze data' });
  }
});


// Start server
connectToMongoDB().then(() => {
  app.listen(8080, () => {
    console.log('API server running on http://localhost:8080');
  });
});