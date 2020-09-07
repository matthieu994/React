module.exports = function (app, port) {
  const http = require('http')
  var server = http.createServer(app).listen(port)

  var io = require('socket.io').listen(server);
  io.set('origins', '*:*');

  require('./tictactoe')(io)
  require('./Live')(io)
  require('./Chat')(io)
};
