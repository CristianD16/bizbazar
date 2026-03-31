const express = require('express');
const cors = require('cors');
const listingsRouter = require('./routes/listings');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/listings', listingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BizBazar API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 BizBazar server running on port ${PORT}`);
});
