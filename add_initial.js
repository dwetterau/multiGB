var nano = require('nano')('http://localhost:5984');
var db = nano.use('multigb');

var count_obj = {
  count: 0
};

db.insert(count_obj, 'room_count', function(err, body) {
  if (err) {
    console.log(err);
  } else {
    console.log(body);
  }
});
