module.exports = function (io) {
    var lio = io.of('/Live');
    lio.on('connection', function (client) {
        client.on('createCode', () => {
            const code = generateCode()
            client.emit('getCode', code)
            client.join(code);
        })
        
        client.on('link', code => {
            client.join(code);
            lio.in(code).emit('linkDone', "Link réussi !");
        })

        client.on('updatePos', data => {
            console.log(data)
            client.broadcast.to(data.code).emit('updatePos', data.direction);
        })
    });
}

const generateCode = function () {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}