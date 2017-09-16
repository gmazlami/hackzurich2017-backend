const io = require('socket.io');

var ioServer;
var socket;

exports.connect = (http) => {
  ioServer = io(http)

  ioServer.on('connection', (s) => {
    socket = s;
  });

  return ioServer
}

exports.socket = () => {
  return socket;
}
