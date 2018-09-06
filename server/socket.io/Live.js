module.exports = function (io) {
    var lio = io.of('/Live');
    lio.on('connection', function (client) {
        client.on('createCode', () => {
            const code = generateCode()
            if (usersCount(io, code) != 0)
                return noRoom(client, code);
            client.emit('getCode', code)
            client.join(code);
        })


        client.on('link', code => {
            if (usersCount(io, code) != 1)
                return noRoom(client, code)
            client.join(code);
            lio.in(code).emit('linkDone', "Link réussi !");
        })

        client.on('updatePos', data => {
            if (data.direction)
                client.broadcast.to(data.code).emit('updatePos', data.direction);
            else
                client.broadcast.to(data.code).emit('updatePos', { X: data.beta, Y: data.gamma });
        })
    });
}

const generateCode = function () {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

const usersCount = function (io, room) {
    if (!io.nsps['/Live'].adapter.rooms[room]) return 0
    return io.nsps['/Live'].adapter.rooms[room].length
}

const noRoom = function (client) {
    client.emit('noRoom', "Ce code n'est pas valide");
}