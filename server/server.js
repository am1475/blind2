// server/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Result = require('./db'); // Import our Mongoose model
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// API endpoint to store a test result
app.post('/api/results', async (req, res) => {
  try {
    const newResult = new Result(req.body);
    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (err) {
    res.status(500).json({ error: 'Error saving result' });
  }
});

// API endpoint to retrieve all test results
app.get('/api/results', async (req, res) => {
  try {
    const results = await Result.find();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching results' });
  }
});

// New API endpoint to store candidate name
app.post('/api/name', async (req, res) => {
  try {
    const { name } = req.body;
    // If you want to satisfy the schema's required fields for test results,
    // you can provide dummy values (e.g., 0) for accuracy and timeTaken.
    const newNameRecord = new Result({ name, accuracy: 0, timeTaken: 0 });
    const savedNameRecord = await newNameRecord.save();
    res.status(201).json(savedNameRecord);
  } catch (err) {
    console.error('Error saving candidate name:', err);
    res.status(500).json({ error: 'Error saving candidate name' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
