module.exports = function (app) {
    var http = require("http").createServer(app);
    var io = require("socket.io")(http);

    io.on('connection', function (client) {
        client.on('joinRoom', (num) => {
            if (io.nsps['/'].adapter.rooms["#" + num] && io.nsps['/'].adapter.rooms["#" + num].length >= 2)
                return fullRoom(client, num);
            client.join("#" + num);
            // client.emit('inRoom', "Vous avez rejoint la salle #" + num);
            io.in('#' + num).emit('inRoom', "Vous avez rejoint la salle #" + num);
        })
    })

    http.listen(5001, "localhost");
}

const fullRoom = (client, num) => {
    client.emit('fullRoom', "La salle #" + num + " est pleine.");
}