console.log('>>> server.js is running');

const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Review Service running on port ${PORT}`);
});