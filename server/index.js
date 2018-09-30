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

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "../react-ui/build")));

// Heroku / localhost mongoose url
let URL;
if (app.get("env") != "development") {
	URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${
		process.env.DB_SERVER
	}`;
} else {
	URL = "mongodb://localhost:27017/todosql";
}

mongoose.connect(
	URL,
	{ useNewUrlParser: true },
	function(err, db) {
		if (err) return err;
		// tools.removeCollection(User);
		// tools.showCollections();
		// tools.deleteAllTokens(User);
		// tools.show(db, 'users', {username: 'test'});
		// tools.removeFriends(User, 'admin')
		// tools.showFriends(User, 'admin')
	}
);

// Todos
require("./TodoList/TodoList")(app);

// User management
require("./Auth/Auth")(app);

// Profile management
require("./Auth/Profile")(app);

// app.post("/auth", (req, res, next) => verifAuth(req, res, next));

// socket.io
require("./socket.io/socket")(app, PORT);

// All remaining requests return the React app, so it can handle routing.
app.use((req, res, next) => {
	// verifAuth(req.body.token).then(isAuth => {
	// 	if (!isAuth) return res.sendStatus(403);
	// 	if (app.get("env") != "development")
			// res.sendFile(path.resolve(__dirname, "../react-ui/build", "index.html"));
	// });
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
