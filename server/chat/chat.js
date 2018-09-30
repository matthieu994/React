var Conversation = require("../models/ChatSchema");
var User = require("../models/UserSchema");
var Tools = require("../Auth/Tools");

module.exports = app => {
	app.post("/chat", (req, res) => {
		Tools.getUser(req.headers.token, res, "friends socket conversations").then(user => {
			user.socket = req.body.socket;
			user.save();
			res.send(user);
		});
	});
};
