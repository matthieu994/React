
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose
const mongoose = require('mongoose');
// const tools = require('./tools');
// const Todo = require('./models/TodoSchema');
// const User = require('./models/UserSchema');
// const models = require('./models/ChatSchema');

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../client/build')));
// app.use("/Portfolio", (req, res) => {
//     express.static(path.resolve(__dirname, "../client/public/PortfolioSrc/"));
// });

// Heroku / localhost mongoose url
let URL;
URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}`;

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
  if (err) console.log(err);
  // tools.removeCollection(User);
  // tools.showCollections(db);
  // tools.deleteAllTokens(User);
  // tools.show(db, 'conversations', {});
  // tools.removeFriends(User, 'admin')
  // tools.removeAllFriends(User)
  // tools.showFriends(User, 'admin')
  // db.collection("users").remove({ username: "abc" });
  // db.collection("conversations").remove({});
});
mongoose.set('useCreateIndex', true);

// Todos
require('./TodoList/TodoList')(app);

// User management
require('./Auth/Auth')(app, path);

// Profile management
require('./Auth/Profile')(app);

// socket.io
require('./socket.io/socket')(app, PORT);

require('./chat/chat')(app);

// All remaining requests return the React app, so it can handle routing.
app.use((req, res, next) => {
  if (app.get('env') !== 'development') res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
});

// app.listen(PORT, () => {
//     console.log(
//         `Node cluster worker ${process.pid}: listening on port ${PORT}`
//     );
// });
