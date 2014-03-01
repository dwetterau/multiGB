var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var state = {};

io.on('connection', function(socket) {
  socket.on("start", function(data) {
    console.log("got a start message");
    socket.join('room:' + data.room_id);
    if (!state[data.room_id]) {
      state[data.room_id] = {
        cur_move: data.state_move + 1
      };
    }
    socket.emit("start_resp", { cur_move: state[data.room_id].cur_move });
  });

  socket.on("add_move", function(data) {
    var move = state[data.room_id].cur_move++;
    var new_data = {
      seq_num: move,
      move: data.move_num
    }
    if (!state[data.room_id].moves) {
      state[data.room_id].moves = {};
    }
    state[data.room_id].moves[move] = data.move_num;
    io.sockets.in('room:' + data.room_id).emit('new_move', new_data);
  });

  socket.on("saved", function(data) {
    var move_to_nuke = data.save_move;
    while (state[data.room_id].moves[move_to_nuke]) {
      delete state[data.room_id].moves[move_to_nuke--];
    }
  });

  socket.on("req_move", function(data) {
    var moves_to_send = [];
    var move_to_get = data.last_move + 1;
    while (state[data.room_id].moves[move_to_get]) {
      moves_to_send.push({
        seq_num: move_to_get,
        move: state[data.room_id].moves[move_to_get]
      });
      move_to_get++;
    }
    socket.emit('move_list', {
      list: moves_to_send
    });
  });
});

server.listen(3000);
