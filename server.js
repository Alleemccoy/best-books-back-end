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
      name: 'Harry Potter and the Sorcerer\'s Stone',
      description: 'Harry Potter and the Sorcerer\'s Stone',
      status: 'read',
      photo: 'https://m.media-amazon.com/images/I/413lxIe20jL.jpg'
    },
    {
      name: 'Harry Potter and the Chamber of Secrets',
      description: 'Harry Potter and the Chamber of Secrets',
      status: 'read',
      photo: 'https://m.media-amazon.com/images/I/51TA3VfN8RL.jpg'
    },
    {
      name: 'Harry Potter and the Prisoner of Azkaban ',
      description: 'Harry Potter and the Prisoner of Azkaban ',
      status: 'read',
      photo: 'https://m.media-amazon.com/images/I/51Dfqo6jR5L.jpg'
    }
  ],
});
/* use save when you seed the database, comment out when you finish seeding the database */
// user.save(function (err) {
//   if (err) console.err(err);
//   else console.log('saved successfully!');
// });

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/books', (req, res) => {
  User.find({ email: req.query.email }, (err, result) => {
    res.send(result[0].books);
  });
});

app.post('/books', (req, res) => {
  // find the user by email
  User.find({ email: req.body.email }, (err, result) => {
    // error handling
    if (err) {
      res.status(500).send(err);
    }

    // if the user not found, send 'user does not exist' message to the frontend
    if (result.length < 1) {
      res.status(400).send('User does not exist');
    } else {
      // if the user found, add new book to that user
      const user = result[0];
      user.books.push({
        name: req.body.books.name,
        description: req.body.books.description,
        status: req.body.books.status,
        photo: req.body.books.photo
      });
      // save the user
      user.save()
        .then(result => {
          res.send(result);
        });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
