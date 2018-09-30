var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var User = require("./UserSchema");

const ChatUser = new Schema({
	user: {
		type: User,
		required: true
	},
	socket: {
		type: String,
		required: false
	}
});

const Conversation = new Schema({
	users: {
		type: [ChatUser]
	},
	messages: {
		type: [Message]
	}
});

const Message = new Schema({
	sender: {
		type: ChatUser
	},
	message: {
		type: String,
		required: true
	}
});

export const ChatUser = mongoose.model("ChatUser", ChatUser);
export const Conversation = mongoose.model("Conversation", Conversation);
