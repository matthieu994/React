module.exports = function (app, port) {
    const http = require('http')
    var server = http.createServer(app).listen(port)
    console.error(`Listening on port ${port}`);

    var io = require('socket.io').listen(server);
    io.set('origins', '*:*');

    require('./tictactoe')(io)
    // server.listen(5001, 'localhost');
    require('./Live')(io)
    require('./Chat')(io)
}