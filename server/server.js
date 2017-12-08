let { GameServer } = require('./classes/GameServer');
let { Logger } = require('./classes/Logger');

let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);


console.log('server run...');

app.use(express.static(__dirname + '/bower_components'));
app.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

let gameServer = new GameServer();

io.on('connection', function (client) {
  gameServer.connectPlayer(client);

  client.on('action', (action) => {
    try {
      switch (action.type) {
          /* ROOM */
        case 'connectToRoom': {
          const { roomId } = action.data;
          gameServer.getRoomById(roomId).connectPlayer(client);
          break;
        }
        case 'doStep': {
          const { roomId, row, cell } = action.data;
          let room = gameServer.getRoomById(roomId);
          room.move(row, cell, client);
          break;
        }
        case 'newGame': {
          const { roomId } = action.data;
          gameServer.getRoomById(roomId).newGame(client);
          break;
        }
        case 'disconnect': {
          gameServer.disconnectPlayer(client);
          break;
        }
          /* CHAT */
        case 'message': {
          const {
            roomId, message, cb = () => {
            }
          } = action.data;
          gameServer.getRoomById(roomId).say(client, message);
          cb();
          break;
        }
      }
    }
    catch (e) {
      Logger.log(e.message);
      client.emit('gameError', e.message);
    }
  });

  client.on('disconnect', () => {
    gameServer.disconnectPlayer(client);
  });
});


server.listen(3001);