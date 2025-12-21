const express = require('express');
const foodRoutes = require('./routes/food.routes');

const app = express();
app.use(express.json());

app.use('/api/foods', foodRoutes);

app.listen(3001, () => {
    console.log('Food Service running on port 3001');
});
