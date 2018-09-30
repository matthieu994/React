var { ChatUser } = require("../models/Chat");
var Tools = require("../Auth/Tools");

module.exports = app => {
    app.get("/chat", (req, res) => {
		Tools.getUser(req.headers.token, res, "socket -_id").then(user => {
            
		});
	});
};
