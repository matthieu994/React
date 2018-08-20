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

// Authenticate
app.use(function (req, res, next) {
  next();
});

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
    // tools.show(db, 'users');
    // tools.removeFriends(User, 'admin')
    // tools.showFriends(User, 'admin')
  });

app.get('/todos', (req, res) => {
  Todo.find(function (err, todos) {
    if (err) return console.error(err);
    res.send(JSON.stringify(todos));
  })
});

app.post('/todos', (req, res) => {
  var todo = new Todo({ text: req.body.text });
  todo.save();
  res.sendStatus(200);
});

app.put('/todos', (req, res) => {
  Todo.findById(req.body.id, function (err, todo) {
    if (err) throw err;
    if (req.body.text != undefined)
      todo.text = req.body.text;
    if (req.body.done != undefined)
      todo.done = req.body.done;
    todo.save(function (err) {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
});

app.delete('/todos', (req, res) => {
  Todo.deleteOne({ _id: req.body.id }, function (err) {
    if (err) return handleError(err);
    res.sendStatus(200);
  });
});

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

async function getUser(token, res) {
  return await jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) return res.sendStatus(403);
    return User.findById(decoded.user, (err, user) => {
      if (err) return err;
      return user
    })
  })
}

app.get('/Profile/username', (req, res) => {
  getUser(req.headers.token, res).then(user => {
    return res.send(user.username)
  })
})

app.get('/Profile/friends', (req, res) => {
  getUser(req.headers.token, res).then(user => {
    return res.send(user.friends)
  })
})

app.post('/Profile/users', (req, res) => {
  var regexp = new RegExp("^" + req.body.startingWith);
  User.find({ username: regexp }, '-_id username', (err, users) => {
    if (err) return err;
    return res.send(users)
  })
})

app.post('/Profile/addFriend', (req, res) => {
  User.findOne({ username: req.body.username }, (err, friend) => {
    if (err) return err;
    getUser(req.headers.token, res).then(user => {
      user.friends.push(friend.username)
      friend.friends.push({_id: user.username, status: 'REQUEST'})
      user.save()
      friend.save()
      return res.sendStatus(200)
    })
  })
})

app.post('/Profile/acceptFriend', (req, res) => {
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

// All remaining requests return the React app, so it can handle routing.
app.use('', function (req, response, next) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
});