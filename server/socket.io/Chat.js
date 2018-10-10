var models = require("../models/ChatSchema");
var User = require("../models/UserSchema");
var Tools = require("../Auth/Tools");
const jwt = require("jsonwebtoken");

module.exports = function(io) {
	var lio = io.of("/Chat");

	lio.on("connection", function(client) {
		jwt.verify(client.handshake.headers.token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) return err;
			client.token = decoded.user;
		});

		client.on("createConversation", (data, cb) => {
			User.findById(client.token, "username conversations", (err, user) => {
				if (err) return err;
				var conversation = new models.Conversation();
				conversation.users.push(user.username);
				conversation.users.push(data.user);
				conversation.messages.push(
					new models.Message({
						sender: user.username,
						message: data.message,
						time: new Date().getTime()
					})
				);
				user.conversations.push(conversation);
				user.save();
				conversation.save();
				User.findOne({ username: data.user }, "", (err, friend) => {
					if (err) return err;
					friend.conversations.push(conversation);
					friend.save();
					cb("OK");
				});
			});
		});

		client.on("sendMessage", data => {
			models.Conversation.findById(data.conversation, (err, conversation) => {
				if (err) return err;
				conversation.messages.push(
					new models.Message({
						sender: data.sender,
						message: data.message,
						time: new Date().getTime()
					})
				);
				conversation.save();
				conversation.users.forEach(username => {
					User.findOne({ username }, "socket", (err, user) => {
						lio.to(`${user.socket}`).emit("newMessage", {
							message: new models.Message({
								sender: data.sender,
								message: data.message,
								time: new Date().getTime()
							}),
							id: data.conversation
						});
					});
				});
			});
		});

		client.on("deleteConversation", id => {
			models.Conversation.findById(id, (err, conversation) => {
				if (err) return err;
				conversation.users.forEach(convUser => {
					User.findOne({ username: convUser }, (err, user) => {
						if (err) return err;
						user.conversations.splice(user.conversations.indexOf(id), 1);
						user.save((err, doc) => {
							lio.to(`${user.socket}`).emit("deleteConversation", id);
						});
					});
				});
				models.Conversation.findByIdAndDelete(id, err => {
					if (err) return err;
				});
			});
		});
	});
};
