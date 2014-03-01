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
            
            // change flow to main page
            main(room_id);
        });
    });

    function transitionPage() {
        // convert page
        $("#pre-game").fadeOut('fast', function () {
            $("#main-content").fadeIn();
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
            
            // ensure page is ready
            $(document).ready(function() {
                main(room_id);
            });
        } else {
            $("#pre-game").fadeIn('fast');
        }
    })();

    // function to begin main page logic
    function main (room_id) {
        if (window.room_id != room_id) {
            console.log("Conflicting room id!!!")
            console.log("window.room_id = " + window.room_id + "| room_id = " + room_id);
        }

        // do other work
    }

})();