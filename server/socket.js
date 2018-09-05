module.exports = function (app) {
    const socketIO = require('socket.io')
    const io = socketIO(require('http').createServer(app))

    io.on('connection', socket => {
        console.log('User connected')

        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })
}