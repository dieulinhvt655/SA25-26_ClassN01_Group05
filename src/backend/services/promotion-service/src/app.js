const express = require('express');
require('dotenv').config();

const promotionRoutes = require('./routes/promotion.route');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Promotion Service is running');
});

app.use('/promotions', promotionRoutes);

module.exports = app;