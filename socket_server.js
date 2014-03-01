var io = require('socket.io')(server);

io.on('connection', function(socket) {

});

io.listen(8080);
