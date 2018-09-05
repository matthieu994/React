module.exports = function (app) {
    const http = require('http')
    const socketIO = require('socket.io')
    const server = http.createServer(app)
    const io = socketIO(server)

    io.set('origins', '*:*');
    io.on('connection', function (client) {
        console.log('connected client', client)
        client.on('joinRoom', (num) => {
            if (io.nsps['/'].adapter.rooms[num] && io.nsps['/'].adapter.rooms[num].length >= 2)
                return fullRoom(client, num);
            client.join(num);

            var clientsCount = io.sockets.adapter.rooms[num].length;
            if (clientsCount === 1)
                playerIs(client, 'X')
            else
                playerIs(client, 'O')

            client.emit('inRoom', "Vous avez rejoint la salle #" + num);
        })

        client.on('play', data => {
            client.broadcast.to(data.room).emit('nextPlayer', { xIsNext: !data.xIsNext, i: data.i });
        })
    })

    // server.listen(5001, 'localhost');
}

const fullRoom = (client, num) => {
    client.emit('fullRoom', "La salle #" + num + " est pleine.");
}

const playerIs = (client, type) => {
    client.emit('playerIs', type);
}