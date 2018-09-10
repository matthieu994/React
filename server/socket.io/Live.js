class Blob {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = 50;
    }
    update(data) {
        this.x = data.x;
        this.y = data.y;
        this.radius = data.radius;
    }
    eats(other) {
        let dist = Math.hypot(this.x - other.x, this.y - other.y)
        if (dist < other.radius) {
            this.radius += other.radius
            other.radius = 0
            return true
        }
        return false
    }
}
const DEV = false;
let blobs = [];

module.exports = function (io) {
    var lio = io.of('/Live');

    lio.on('connection', function (client) {
        // Sent by PC
        client.on('createCode', () => {
            const code = generateCode()
            if (usersCount(io, code) != 0)
                return noRoom(client, code);
            client.emit('getCode', code)
            client.join(code);
        })

        // Sent by phone
        client.on('link', code => {
            if (usersCount(io, code) != 1)
                return noRoom(client, code)
            client.join(code);
            lio.in(code).emit('linkDone', "Link réussi !");
        })

        // Sent by PC after link to init game communication
        client.on('createBlob', () => {
            blobs.push(new Blob(client.id, 0, 0))
        })

        // Phone => PC
        client.on('updatePos', data => {
            client.broadcast.to(data.code).emit('updatePos', { degX: data.gamma, degY: data.beta });
        })

        // PC => Server
        client.on('updateBlobPos', data => {
            let blob = blobs.find(blob => blob.id === client.id)
            if (!blob) return
            blob.update(data)

            blobs.forEach((item) => {
                if (item.id !== client.id && blob.eats(item)) {
                    deleteBlob(item.id)
                }
            })
        })
        
        client.on('leave', code => {
            client.broadcast.to(code).emit('leave');
            client.leave(code)
        })

        client.on('disconnect', () => {
            deleteBlob(client.id)
        })

        client.on('eatBlob', data => {
            deleteBlob(data.id)
        })

        const beat = () => {
            lio.emit('beat', blobs)
        }

        setInterval(beat, 33);
    });
}

const deleteBlob = id => {
    if (!blobs) return
    var index = blobs.findIndex(blob => blob.id === id)
    if (index !== -1) blobs.splice(index, 1);
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