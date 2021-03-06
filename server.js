const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1/socialMedia',
  function (err, db) {
    if (err) {
      throw err;
    }
    console.log('db connected');
  }
);

mongoose.set('debug', true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

mongoose.connection.on('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on localhost:${PORT}!`);
  });
});
