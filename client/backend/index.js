require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
connectDB();

app.use(cors({
  origin: [
    /^http:\/\/localhost:\d+$/,
    /\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5005;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
