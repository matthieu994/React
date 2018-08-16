const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const tools = require('./tools');

const PORT = process.env.PORT || 5000;

if (cluster.isMaster) {
  // console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();
  const bodyParser = require('body-parser');
  require('dotenv').config();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Mongoose
  const mongoose = require('mongoose');
  var Todo = require('./models/TodoSchema');
  var User = require('./models/UserSchema');

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
  app.use(function(req, res) {
    res.redirect('/register');
  });

  // // Answer API requests.
  // app.get('/api', function (req, res) {
  //   res.set('Content-Type', 'application/json');
  //   res.send('{"message":"Hello from the custom server!"}');
  // });

  // Heroku / localhost mongoose url
  let URL;
  if (app.get('env') != 'development') { URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}` }
  else { URL = 'mongodb://localhost:27017/todosql' }

  mongoose.connect(
    URL,
    { useNewUrlParser: true }, function (err, db) {
      if (err) return err;
      // User.remove({}, function (err) {
      //   console.log('collection removed')
      // });
      // tools.showCollections();
      // tools.show(db, 'users');
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
      if (req.body.id != undefined)
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
        success: false,
        message: 'Erreur: Pseudo invalide.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Erreur: Mot de passe invalide.'
      });
    }

    User.find({ username: username }, (err, user) => {
      if (err) return err;
      if (user.length > 0) {
        return res.send({
          success: false,
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

  // All remaining requests return the React app, so it can handle routing.
  app.use('*', function (req, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}
