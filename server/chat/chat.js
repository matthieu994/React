var mongoose = require("mongoose");
var models = require("../models/ChatSchema");
var User = require("../models/UserSchema");
var Tools = require("../Auth/Tools");

module.exports = app => {
	app.get("/Chat", (req, res) => {
		Tools.getUser(req.headers.token, res, "socket username friends conversations").then(user => {
			user.socket = req.query.socket;
			user.save();
			// user.conversations.pop();
			let newUser = JSON.parse(JSON.stringify(user));
			var promises = newUser.friends.map((friend, index) => {
				if (friend.status !== "OK") return (friend = null);
				return Tools.getUserImg(friend._id).then(img => {
					if (!img) return;
					friend.url = img.image;
					return friend;
				});
			});
			Promise.all(promises).then(function(results) {
				newUser.friends = results.filter(friend => friend);

				var promisesConversations = newUser.conversations.map(convo => {
					return models.Conversation.findById(convo, (err, convoDetails) => {
						if (err) return err;
						convo = convoDetails;
						return convo;
					});
				});
				Promise.all(promisesConversations).then(results => {
					newUser.conversations = results;
					res.send(newUser);
				});
			});
		});
	});
};
