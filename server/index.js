"use strict";

const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const tools = require('./tools');

const PORT = process.env.PORT || 5000;

const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose
const mongoose = require('mongoose');
var Todo = require('./models/TodoSchema');
var User = require('./models/UserSchema');

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Heroku / localhost mongoose url
let URL;
if (app.get('env') != 'development') { URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}` }
else { URL = 'mongodb://localhost:27017/todosql' }

mongoose.connect(
  URL,
  { useNewUrlParser: true }, function (err, db) {
    if (err) return err;
    // tools.removeCollection(User);
    // tools.showCollections();
    // tools.deleteAllTokens(User);
    // tools.show(db, 'users', {username: 'test'});
    // tools.removeFriends(User, 'admin')
    // tools.showFriends(User, 'admin')
  });

// Todos
require('./TodoList/TodoList')(app)

// User management
var bcrypt = require('bcrypt');
const saltRounds = 10;

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.send({
      message: 'Erreur: Pseudo invalide.'
    });
  }
  if (!password) {
    return res.send({
      message: 'Erreur: Mot de passe invalide.'
    });
  }

  User.find({ username: username }, (err, user) => {
    if (err) return err;
    if (user.length > 0) {
      return res.send({
        message: 'Erreur: Pseudo déjà pris.'
      });
    }
  });

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (err) return err;
    var user = new User({ username: req.body.username, password: hash });
    user.save(function (err) {
      if (err) return err;
      res.sendStatus(200);
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  var hash;

  User.find({ username: username }, (err, user) => {
    if (err) return err;
    if (user.length < 1) {
      return res.send({
        message: 'Erreur: Identifiants invalides.'
      });
    }

    // Compare hash et password de l'user
    bcrypt.compare(password, user[0].password, function (err, result) {
      if (err) return err;
      if (!result) {
        return res.send({
          message: 'Erreur: Identifiants invalides.'
        });
      }

      // Genère un token si non existant dans la DB
      User.findById(user[0].id, (err, user) => {
        if (!user.token) {
          jwt.sign({ user: user._id }, process.env.JWT_SECRET, function (err, token) {
            if (err) return err;
            user.token = token;
            user.save(() => {
              return res.send({
                token: user.token
              });
            });
          });
        }
        else {
          return res.send({
            token: user.token
          });
        }
      });
    });
  });
});

function verifAuth(req, res) {
  console.log('req')
  if (!req.body.token) return res.sendStatus(204);
  jwt.verify(req.body.token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) return res.sendStatus(204);
    User.findById(decoded.user, (err, user) => {
      if (err) return err;
      if (req.body.token == user.token) {
        return res.sendStatus(200);
      }
    });
  });
}

app.post('/auth', (req, res) => verifAuth(req, res))

async function getUser(token, res, props) {
  return await jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) return res.sendStatus(204);
    return User.findById(decoded.user, props, (err, user) => {
      if (err) return err;
      return user
    })
  })
}

async function getUserImg(username) {
  return await User.findOne({ username: username }, '-_id image', (err, img) => {
    if (err) return err;
    return img
  })
}

app.get('/Profile', (req, res) => {
  getUser(req.headers.token, res, "-_id username image").then(user => {
    return res.send(user)
  })
})

app.get('/Profile/friends', (req, res) => {
  getUser(req.headers.token, res, "-_id friends").then(user => {
    var promises = JSON.parse(JSON.stringify(user.friends)).map((friend) => {
      return getUserImg(friend._id).then(img => {
        friend.url = img.image;
        return friend;
      })
    })
    Promise.all(promises).then(function (results) {
      res.send(results)
    })
  })
})

app.post('/Profile/users', (req, res) => {
  var regexp = new RegExp("^" + req.body.startingWith);
  User.find({ username: regexp }, '-_id username', (err, users) => {
    if (err) return err;
    return res.send(users)
  })
})

app.post('/Profile/friend', (req, res) => {
  User.findOne({ username: req.body.username }, (err, friend) => {
    if (err) return err;
    getUser(req.headers.token, res).then(user => {
      user.friends.push(friend.username)
      friend.friends.push({ _id: user.username, status: 'REQUEST' })
      user.save()
      friend.save()
      return res.sendStatus(200)
    })
  })
})

app.put('/Profile/friend', (req, res) => {
  User.findOne({ username: req.body.username }, (err, friend) => {
    if (err) return err;
    getUser(req.headers.token, res).then(user => {
      user.friends.find(fr => fr._id === friend.username).status = "OK"
      friend.friends.find(fr => fr._id === user.username).status = "OK"
      user.save()
      friend.save()
      return res.sendStatus(200)
    })
  })
})

app.delete('/Profile/friend', (req, res) => {
  User.findOne({ username: req.body.username }, 'username friends', (err, friend) => {
    if (err) return err;
    getUser(req.headers.token, res, "username friends").then(user => {
      user.friends = user.friends.filter(function( obj ) {
        return obj._id != friend.username;
      });
      user.save()
      friend.friends = friend.friends.filter(function( obj ) {
        return obj._id != user.username;
      });
      friend.save()
      return res.sendStatus(200)
    })
  })
})

// All remaining requests return the React app, so it can handle routing.
app.use('', function (req, response, next) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
});