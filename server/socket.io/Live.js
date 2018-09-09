const DEV = true;
let blobs = [];

module.exports = function (io) {
    var lio = io.of('/Live');

    lio.on('connection', function (client) {
        client.on('createCode', () => {
            const code = generateCode()
            if (usersCount(io, code) != 0)
                return noRoom(client, code);
            client.emit('getCode', {
                code, id: client.id
            })
            client.join(code);
            blobs.push({ id: client.id, x: 0, y: 0, radius: 50 })
        })

        client.on('link', code => {
            if (usersCount(io, code) != 1)
                return noRoom(client, code)
            client.join(code);
            lio.in(code).emit('linkDone', "Link réussi !");
        })

        client.on('updatePos', data => {
            client.broadcast.to(data.code).emit('updatePos', { degX: data.gamma, degY: data.beta });
        })

        client.on('updateBlobPos', data => {
            let blob = blobs.find(blob => blob.id === client.id)
            blob.x = data.x
            blob.y = data.y
            blob.radius = data.radius
        })

        client.on('leave', code => {
            client.broadcast.to(code).emit('leave');
        })

        client.on('disconnect', () => {
            let blob = blobs.find(blob => blob.id === client.id)
            blob = null
        })

        const beat = () => {
            lio.emit('beat', blobs)
        }

        setInterval(beat, 33);
    });
}


const generateCode = function () {
    if (DEV)
        return "DEVCODE"
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

const usersCount = function (io, room) {
    if (!io.nsps['/Live'].adapter.rooms[room]) return 0
    return io.nsps['/Live'].adapter.rooms[room].length
}

const noRoom = function (client) {
    client.emit('noRoom', "Ce code n'est pas valide");
}