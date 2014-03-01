window.all_moves = {};

// socket setup

window.socket = io.connect('http://localhost:3000');
console.log("got connected, sending start");
window.socket.emit("start", { 
    room_id: window.room_id, 
    state_move: window.last_move
});

window.socket.on("move_list", function(data) {
  for (var i = 0; i < data.list.length; i++) {
    if (!window.all_moves[data.list[i].seq_num]) {
      window.all_moves[data.list[i].seq_num] = data.list[i].move;
    }
  }
});

window.socket.on("new_move", function(data) {
  console.log("got a new move!", data);
  window.all_moves[data.seq_num] = data.move;
});

// window functions
window.i_saved = function(save_move) {
  var data = {
    room_id: window.room_id,
    save_move: save_move
  };
  window.socket.emit("saved", data);
}

window.send_move = function(move) {
  var data = {
    room_id: window.room_id,
    move_num: move
  };
  console.log("sending an add_move");
  window.socket.emit("add_move", data);
}

window.do_move = function() {
  console.log("doing a move");
  if (window.all_moves[window.last_move + 1]) {
    console.log("have a move to do...");
    window.process_key([window.all_moves[window.last_move + 1]]);
    delete window.all_moves[window.last_move];
    window.last_move++;
    console.log("new last_move=", window.last_move);
  } else {
    window.get_next_move();
  }
}

window.get_next_move = function() {
  window.socket.emit("req_move", {
    room_id: window.room_id,
    last_move: window.last_move
  });
};
