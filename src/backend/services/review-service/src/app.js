console.log('>>> app.js loaded');

const express = require('express');
require('dotenv').config();

const reviewRoutes = require('./routes/review.route');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Review Service is running');
});

app.use('/reviews', reviewRoutes);

module.exports = app;