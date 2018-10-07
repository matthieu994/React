var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const MessageSchema = new Schema({
	_id: false,
	sender: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	time: {
		type: Date
	}
});

const ConversationSchema = new Schema({
	users: {
		type: [String]
	},
	messages: {
		type: [MessageSchema]
	}
});

var Conversation = mongoose.model("Conversation", ConversationSchema);
var Message = mongoose.model("Message", MessageSchema);

module.exports = {
	Conversation: Conversation,
	Message: Message
};
