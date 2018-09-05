module.exports = function (app) {
    var http = require("http").createServer(app);
    var io = require("socket.io")(http);

    io.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('disconnect', () => console.log('Client disconnected'));
    })

    http.listen(8080, "localhost");
}