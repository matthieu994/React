var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var User = require("./UserSchema");

const Message = new Schema({
	sender: {
		type: User.schema
	},
	message: {
		type: String,
		required: true
	}
});

const Conversation = new Schema({
	users: {
		type: [User.schema],
		required: true
	},
	messages: {
		type: [Message]
	}
});

module.exports = {
	Conversation: mongoose.model("Conversation", Conversation)
};
