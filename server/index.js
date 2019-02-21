"use strict";

const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const tools = require("./tools");

const PORT = process.env.PORT || 5000;

const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose
const mongoose = require("mongoose");
var Todo = require("./models/TodoSchema");
var User = require("./models/UserSchema");
var models = require("./models/ChatSchema");

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "../react-ui/build")));
app.use("/DevFolio", (req, res) => {
    res.status(200).sendFile(
        path.resolve(__dirname, "public", "DevFolio/index.html")
    );
});

// Heroku / localhost mongoose url
let URL;
// if (app.get("env") != "development") {
URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${
    process.env.DB_SERVER
}`;
// } else {
// URL = "mongodb://localhost:27017/todosql";
// }

mongoose.connect(URL, { useNewUrlParser: true }, function(err, db) {
    if (err) return err;
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
mongoose.set("useCreateIndex", true);

// Todos
require("./TodoList/TodoList")(app);

// User management
require("./Auth/Auth")(app);

// Profile management
require("./Auth/Profile")(app);

// socket.io
require("./socket.io/socket")(app, PORT);

require("./chat/chat")(app);

app.post("/auth", (req, res) => {
    let token = req.body.token ? req.body.token : req.headers.token;
    verifAuth(token).then(isAuth => {
        if (app.get("env") != "development") {
            if (!isAuth)
                return res
                    .status(403)
                    .sendFile(
                        path.resolve(
                            __dirname,
                            "../react-ui/build",
                            "index.html"
                        )
                    );
            res.status(200).sendFile(
                path.resolve(__dirname, "../react-ui/build", "index.html")
            );
        } else {
            if (!isAuth) return res.sendStatus(403);
            res.sendStatus(200);
        }
    });
});

// All remaining requests return the React app, so it can handle routing.
app.use((req, res, next) => {
    if (app.get("env") != "development")
        res.sendFile(
            path.resolve(__dirname, "../react-ui/build", "index.html")
        );
});

// app.listen(PORT, function () {
//   console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
// });

function verifAuth(token) {
    return new Promise(resolve => {
        if (!token) resolve(false);
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) resolve(false);
            User.findById(decoded.user, (err, user) => {
                if (err) resolve(false);
                if (token == user.token) {
                    resolve(true);
                }
            });
        });
    });
}
