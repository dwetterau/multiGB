var express = require('express');
var app = express();
var server = require('http').Server(app);

// DB stuff
var nano = require('nano')('http://localhost:5984');
var db = nano.use('multigb');

app.use(express.bodyParser());
app.use('/', express.static(__dirname + '/site/'));

function send_error(res, err) {
  res.send({status: "fail", err: err});
}

app.get('/make_room', function(req, res) {
  db.get('room_count', {revs_info: true}, function(err, body) {
    if (!err) {
      body.count += 1;
      var new_count = body.count;
      db.insert(body, 'room_count', function(err, body) {
        if (!err) {
          var id = "room:" + new_count;
          db.insert({last_move: 0, state: undefined}, id, function(err, body) {
            if (!err) {
              res.send({status: 'ok', id: new_count});
            } else {
              send_error(res, err);  
            }
          });
        } else {
          send_error(res, err);  
        }
      });
    } else {
      send_error(res, err);  
    }
  });  
});

app.get('/room/:id', function(req, res) {
  var room_id = "room:" + req.params.id;
  db.get(room_id, { revs_info: true }, function(err, body) {
    if (!err) {
      res.send({status: 'ok', room: body});
    } else {
      send_error(res, err);
    }
  });
});

app.post('/update_room', function(req, res) {
  var id = "room:" + req.body.id;
  var state = req.body.state;
  var last_move = req.body.last_move;

  db.get(id, { revs_info: true }, function(err, body) {
    if (!err && body.last_move < last_move) {
      var to_insert = body;
      to_insert.state = state;
      to_insert.last_move = last_move;
      db.insert(to_insert, id, function(err, body) {
        if (!err) {
          res.send({status: "ok"});
        } else {
          res.send({status: "fail", err: err});
        }
      });
    } else {
      res.send(500);
    }
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server listening on", port);
});
