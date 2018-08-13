const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();
  const bodyParser = require('body-parser');
  if (app.get('env') == 'development'){ require('dotenv').config(); }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Mongoose
  const mongoose = require('mongoose');
  var Todo = require('./Models/TodoSchema');

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // // Answer API requests.
  // app.get('/api', function (req, res) {
  //   res.set('Content-Type', 'application/json');
  //   res.send('{"message":"Hello from the custom server!"}');
  // });

  mongoose.connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}`,
    { useNewUrlParser: true },
    function () {
      //   Todo.remove({}, function(err) { 
      //     console.log('collection removed') 
      //  });
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

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
}
