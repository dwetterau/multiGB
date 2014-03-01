window.all_moves = {};


// socket setup

//window.socket = io.connect('http://multigb.dwett.com:3000');
window.socket = io.connect('http://localhost:3000');
window.socket.on('youare', function(data) {
	window.client_num = data.client_num;
}); 
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

window.socket.on("u_save", function(data) {
  window.saveProgress();
});

window.socket.on("u_load", function(data) {
  window.loadProgress();
});

window.socket.on("new_move", function(data) {
  window.all_moves[data.seq_num] = data.move;
});
window.socket.on('receive_chat', function(data) {
  window.console.log('got message',data.message);
  $('#chatlog').append("<div>"+data.message+"</div>");

  var elem = document.getElementById('chatlog');
    elem.scrollTop = elem.scrollHeight;
    elem.scrollLeft = 0;

});
// window functions
window.i_saved = function(save_move) {
  var data = {
    room_id: window.room_id,
    save_move: save_move
  };
  window.socket.emit("saved", data);
}

window.send_chat = function(message) {

  if (message == '' || message == undefined) return;

  var chat_name = $('#chat-name').val();
  if (chat_name == undefined || chat_name == '') {
    message = "<b>" + window.client_num + "</b>: "+ message;
  } else {
    message = "<b>" + chat_name + "</b>: " + message;
  }

	window.console.log('send chat');
	var data = {
		room_id: window.room_id,
		clientnum: window.client_num,
		message: message
	}
	window.socket.emit('send_chat', data);
};


window.send_move = function(move) {
  if (window.last_do_move === undefined) {
    window.last_do_move = new Date().getTime();
  } else if (new Date().getTime() - window.last_do_move < 40) {
    return;
  }
  window.last_do_move = new Date().getTime();
  var data = {
    room_id: window.room_id,
    move_num: move
  };
  window.socket.emit("add_move", data);
}

window.do_move = function() {
  if (window.all_moves[window.last_move + 1] !== undefined) {
    window.process_keys([window.all_moves[window.last_move + 1]]);
    delete window.all_moves[window.last_move];
    window.last_move++;
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
