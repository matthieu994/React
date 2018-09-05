module.exports = function (app) {
    var http = require("http").createServer(app);
    var io = require("socket.io")(http);

    io.on('connect', (socket) => {
        console.log('Client connected');
        socket.on('disconnect', () => console.log('Client disconnected'));

        socket.on('message', function (msg) {
            io.emit('message', msg);
            console.log('message: ' + msg);
        });
    })

    http.listen(8080, "localhost");
}