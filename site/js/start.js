// start.js
// shit to do when this starts (duh)

(function() {
    // bind event handler to button
    $("#create-room").click(function() {
        $.get('/make_room', function (data) {
            
            // was there an issue?
            if (data.status != 'ok') {
                console.log("There is a problem, /make_room returned: " + data.status);
                console.log("Halting...");
                return;
            }

            // grab the room id
            var room_id = data.id;
            // set window for future shit
            window.room_id = data.id;
            // push new state
            window.history.pushState({}, "FB ATX Hackathon 2014", '/?' + room_id);
            // ensure ui follows suit
            transitionPage();
        });
    });

    function transitionPage() {
        // convert page
        $("#pre-game").fadeOut('fast', function () {
            $("#gif").attr("src", "images/gameboy.gif");
            $("#main-content").fadeIn('fast', function() {

                var top = $('#canvas-wrap').offset().top;
                console.log($('#canvas-wrap').offset());
                console.log(top);
                $(window).scrollTop( top );

                $(".button").click(function(ev) {
                  ev.preventDefault();
                  // button pressed
                  var button = $(this).parent().attr("id").split("-")[0];
                  if (button == "nothing") return;
                  
                  // make event
                  console.log(button);

                  if (button == "left") {
                    window.send_move(1);
                  } else if (button == "right") {
                    window.send_move(0);
                  } else if (button == "up") {
                    window.send_move(2);
                  } else if (button == "down") {
                    window.send_move(3);
                  } else if (button == "a") {
                    window.send_move(4);
                  } else if (button == "b'") {
                    window.send_move(5);
                  } else if (button == "start") {
                    window.send_move(7);
                  } else if (button == "select") {
                    window.send_move(6);
                  }

                });
            });
        });

        $('#chat-form').submit(function(ev) {
            ev.preventDefault();
            var message = $("#chat-message").val();
            // send to whoever
            if (window.send_chat == undefined) {
              console.log("not ready come back later");
              return;
            }
            window.send_chat(message);
            // clear chat message
            $("#chat-message").val("");
        });
    }

    // check if url - only at start
    (function checkRoomExists() {
        // set global loop id
        // call looping functions
        var path = window.location.search;
        if (path.substring(1).match(/^\d+$/)) {
            var room_id = Number(path.substring(1));

            // once again, set window
            window.room_id = room_id;
            transitionPage();
        } else {
            $("#pre-game").fadeIn('fast');
        }
    })();
})();

// function to begin main page logic
function main() {
    loadProgress();  
    
    $("#save-button").click(function() {
        saveProgress();
    });
}

function load_game_js() {
  if (window.already_loaded_before) {
    return;
  }
  var item_socket = document.createElement('script');
  item_socket.type = "text/javascript";
  item_socket.async = true;
  item_socket.src = '/js/socket_client.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(item_socket, s);

  var item_key = document.createElement('script');
  item_key.type = "text/javascript";
  item_key.async = true;
  item_key.src = '/js/key_trap.js';
  s.parentNode.insertBefore(item_key, s);
  
  // enabled send button
  $('#send-chat').removeAttr("disabled");

  setInterval(function() {
    if (!window.do_move) {
      return;
    }
    window.do_move();
  }, 40); //25 moves / sec goal
  window.already_loaded_before = true;
}

window.already_loaded_before = false;

function loadProgress() {
  // make get request for room information
  $.get('/room/' + window.room_id, function(data) {
      // was there an issue?
      if (data.status != 'ok') {
          console.log("There is a problem, /make_room returned: " + data.status);
          console.log("Halting...");
          return;
      }

      // set the last move
      window.last_move = data.room.last_move;

      // we need to load game state
      if (data.room.state != undefined) {
          // load state into gbc
          // TODO can't happen until upload rom
          window.loadState(data.room.state);
      }
      load_game_js();
  });
}

function saveProgress() {
    console.log("Saving...");
    var data = {
        id: window.room_id,
        state: window.dumpState(),
        last_move: window.last_move
    };
    var start = new Date().getTime();
    $.post('/update_room', data, function(res) {
        window.i_saved(data.last_move);
        console.log("saving took", new Date().getTime() - start);
    });
}
