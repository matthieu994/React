var Conversation = require("../models/ChatSchema");
var User = require("../models/UserSchema");
var Tools = require("../Auth/Tools");

module.exports = app => {
	app.post("/chat", (req, res) => {
		Tools.getUser(req.headers.token, res, "friends conversations").then(user => {
			user.socket = req.body.socket;
			user.save();
			let newUser = JSON.parse(JSON.stringify(user));
			var promises = newUser.friends.map((friend, index) => {
				if (friend.status !== "OK") return (friend = null);
				return Tools.getUserImg(friend._id).then(img => {
					friend.url = img.image;
					return friend;
				});
			});
			Promise.all(promises).then(function(results) {
				newUser.friends = results.filter(friend => friend);
				res.send(newUser);
			});
		});
	});
};
