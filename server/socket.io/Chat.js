module.exports = function(io) {
	var lio = io.of("/Chat");

	lio.on("connection", function(client) {
        console.log("connect")
        client.on("disconnect", () => {
            console.log("disconnect")
		});
    });
};
