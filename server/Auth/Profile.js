var User = require("../models/UserSchema");
var userTools = require("./Tools");

module.exports = function(app) {
	app.get("/Profile/data", (req, res) => {
		userTools
			.getUser(req.headers.token, res, "username image")
			.then(user => {
				if (!user) return res.sendStatus(403);
				return res.send(user);
			})
			.catch(err => {
				console.log(err);
			});
	});

	app.put("/Profile/image", (req, res) => {
		userTools.getUser(req.headers.token, res).then(user => {
			user.image = req.body.url;
			user.save();
			return res.sendStatus(200);
		});
	});

	app.get("/Profile/friends", (req, res) => {
		userTools.getUser(req.headers.token, res, "-_id friends").then(user => {
			var promises = JSON.parse(JSON.stringify(user.friends)).map(friend => {
				return userTools.getUserImg(friend._id).then(img => {
					friend.url = img.image;
					return friend;
				});
			});
			Promise.all(promises).then(function(results) {
				res.send(results);
			});
		});
	});

	app.post("/Profile/users", (req, res) => {
		var regexp = new RegExp("^" + req.body.startingWith);
		User.find({ username: regexp }, "-_id username", (err, users) => {
			if (err) return err;
			return res.send(users);
		});
	});

	app.post("/Profile/friend", (req, res) => {
		User.findOne({ username: req.body.username }, (err, friend) => {
			if (err) return err;
			userTools.getUser(req.headers.token, res).then(user => {
				user.friends.push(friend.username);
				friend.friends.push({ _id: user.username, status: "REQUEST" });
				user.save();
				friend.save();
				return res.sendStatus(200);
			});
		});
	});

	app.put("/Profile/friend", (req, res) => {
		User.findOne({ username: req.body.username }, (err, friend) => {
			if (err) return err;
			userTools.getUser(req.headers.token, res).then(user => {
				user.friends.find(fr => fr._id === friend.username).status = "OK";
				friend.friends.find(fr => fr._id === user.username).status = "OK";
				user.save();
				friend.save();
				return res.sendStatus(200);
			});
		});
	});

	app.delete("/Profile/friend", (req, res) => {
		User.findOne({ username: req.body.username }, "username friends", (err, friend) => {
			if (err) return err;
			userTools.getUser(req.headers.token, res, "username friends").then(user => {
				user.friends = user.friends.filter(function(obj) {
					return obj._id != friend.username;
				});
				user.save();
				friend.friends = friend.friends.filter(function(obj) {
					return obj._id != user.username;
				});
				friend.save();
				return res.sendStatus(200);
			});
		});
	});

	app.post("/share", (req, res) => {
		User.findOne({ username: req.body.friend }, "todos", (err, friend) => {
			if (friend.todos.indexOf(req.body.todo) >= 0) {
				return;
			}
			friend.todos.push(req.body.todo);
			friend.save();
		});
	});
};
