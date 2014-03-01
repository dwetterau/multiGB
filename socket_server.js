var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

io.set('log level', 2);
var state = {};

var clientnum = 0;

io.on('connection', function(socket) {
	socket.emit('youare', {client_num:clientnum++});
  socket.on("start", function(data) {
    console.log("got start");
    socket.join('room:' + data.room_id*1);
    if (!state[data.room_id*1]) {
      state[data.room_id*1] = {
        cur_move: data.state_move + 1
      };
    }
    socket.emit("start_resp", { cur_move: state[data.room_id*1].cur_move });
  });

  socket.on("add_move", function(data) {
    if (!state[data.room_id*1]) {
      console.log("ROOM DOESN'T EXIST?");
      return;
    }
    var move = state[data.room_id*1].cur_move++;
    var new_data = {
      seq_num: move,
      move: data.move_num
    };
    if (!state[data.room_id*1].moves) {
      state[data.room_id*1].moves = {};
    }
    state[data.room_id*1].moves[move] = data.move_num;
    if (move > 0 && move % 50 == 0) {
      socket.emit('u_save', {});
    }
    io.sockets.in('room:' + data.room_id*1).emit('new_move', new_data);
  });

  socket.on("saved", function(data) {
    if (!state[data.room_id*1].moves) {
      return;
    }
    var move_to_nuke = data.save_move*1;
    while (state[data.room_id*1].moves[move_to_nuke]) {
      delete state[data.room_id*1].moves[move_to_nuke--];
    }
    io.sockets.in('room:' + data.room_id*1).emit('u_load', {});
  });

  socket.on("req_move", function(data) {
    if (!state[data.room_id*1] || !state[data.room_id*1].moves) {
      return;
    }
    var moves_to_send = [];
    var move_to_get = data.last_move*1 + 1;
    while (state[data.room_id*1].moves[move_to_get] !== undefined) {
      moves_to_send.push({
        seq_num: move_to_get,
        move: state[data.room_id*1].moves[move_to_get]
      });
      move_to_get++;
    }
    socket.emit('move_list', {
      list: moves_to_send
    });
  });
	socket.on('send_chat', function(data) {
		console.log('relaying message m');
		io.sockets.in('room:'+data.room_id).emit('receive_chat', data);
	});
});

server.listen(3000);
