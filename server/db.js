// server/db.js
const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  name: {
    type: String,
    // Not every document will have a name (e.g. test results might be posted separately)
    required: false,
  },
  accuracy: {
    type: Number,
    required: false, // Changed to false so that name-only submissions are allowed
  },
  timeTaken: {
    type: Number,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Result2', ResultSchema);
