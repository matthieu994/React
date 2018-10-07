const jwt = require("jsonwebtoken");
var User = require("../models/UserSchema");

module.exports = {
	getUser: async function(token, res, props) {
		return await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (!token || err) return res.sendStatus(403);
			console.log(decoded);
			return User.findById(decoded.user, props, (err, user) => {
				if (err) res.sendStatus(403);
				return user;
			});
		});
	},
	getUserImg: async function(username) {
		return await User.findOne({ username: username }, "-_id image", (err, img) => {
			if (err) return err;
			return img;
		});
	}
};
