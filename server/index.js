require("dotenv").config();

const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose
const mongoose = require("mongoose");
// const tools = require('./tools');
// const Todo = require('./models/TodoSchema');
const User = require("./models/UserSchema");
// const models = require('./models/ChatSchema');

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "../client/build")));

// Heroku / localhost mongoose url
let URL;
// if (app.get("env") != "development") {
URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}`;
// } else {
// URL = "mongodb://localhost:27017/todosql";
// }

mongoose.connect(
  URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, db) => {
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
  }
);
mongoose.set("useCreateIndex", true);

// Auth
function verifAuth(token) {
  return new Promise((resolve) => {
    if (!token) resolve(false);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) resolve(false);
      User.findById(decoded.user, (user_err, user) => {
        if (user_err) resolve(false);
        if (token === user.token) {
          resolve(true);
        }
      });
    });
  });
}

let api = express.Router();
app.use("/api", api);

api.post("/auth", (req, res) => {
  const token = req.headers.authorization
    ? req.headers.authorization
    : req.body.token;
  verifAuth(token).then((isAuth) => {
    if (app.get("env") != "development") {
      if (!isAuth)
        res
          .status(403)
          .sendFile(path.resolve(__dirname, "../client/build", "index.html"));
      else
        res
          .status(200)
          .sendFile(path.resolve(__dirname, "../client/build", "index.html"));
    } else {
      if (!isAuth) res.sendStatus(403);
      else res.sendStatus(200);
    }
  });
});

// Todos
require("./TodoList/TodoList")(api);

// User management
require("./Auth/Auth")(api, path);

// Profile management
require("./Auth/Profile")(api);

// socket.io
require("./socket.io/socket")(app, PORT);

require("./chat/chat")(api);

// All remaining requests return the React app, so it can handle routing.
app.use((req, res, next) => {
  if (app.get("env") !== "development")
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});
