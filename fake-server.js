var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.bodyParser());
app.use('/', express.static(__dirname + '/site/'));

function send_error(res, err) {
  res.send({status: "fail", err: err});
}

app.get('/make_room', function(req, res) {
  res.send({status: 'ok', id: 1}); 
});

app.get('/room/:id', function(req, res) {
  var room_id = "room:" + req.params.id;

  res.send({status: "ok", room: {last_move: 0, state: undefined } });
});

app.post('/update_room', function(req, res) {
  var id = "room:" + req.body.id;
  var state = req.body.state;
  var last_move = req.body.last_move;

  res.send({status: "ok"});
});

var port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log("Server listening on", port);
});
