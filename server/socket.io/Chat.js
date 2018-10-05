module.exports = function(io) {
	var lio = io.of("/Chat");

	lio.on("connection", function(client) {
		client.on("disconnect", () => {});
	});
};
