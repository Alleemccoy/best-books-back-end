const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const User = require('./models/User');

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('mongodb is connected!'));

// seed our books database
const user = new User({
  email: 'test10@test.com',
  books: [
    {
      name: 'Harry Potter4',
      description: 'Harry Potter4',
      status: 'read'
    },
    {
      name: 'Harry Potter5',
      description: 'Harry Potter5',
      status: 'read'
    },
    {
      name: 'Harry Potter6',
      description: 'Harry Potter6',
      status: 'read'
    }
  ],
});
/* use save when you seed the database, comment out when you finish seeding the database */
// user.save(function (err) {
//   if (err) console.err(err);
//   else console.log('saved successfully!');
// });

app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/books', (req, res) => {
  User.find({ email: req.query.email }, (err, result) => {
    res.send(result[0].books);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
