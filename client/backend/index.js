require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

app.use(cors({
  origin: [
    /^http:\/\/localhost:\d+$/,
    /^https:\/\/.*\.vercel\.app$/,
    'https://lab-manual-submission-portal.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());

// Serve uploaded files statically (only useful locally)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to DB before handling routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    return res.status(500).json({ msg: 'Database connection failed. Please check server configuration.' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
