Mousetrap.bind('left', function(e) {
	if (e.preventDefault) e.preventDefault();
	window.send_move(1); });
Mousetrap.bind('right', function(e) {
	if (e.preventDefault) e.preventDefault();
	window.send_move(0); });
Mousetrap.bind('up', function(e) {
	if (e.preventDefault) e.preventDefault();
	window.send_move(2); });
Mousetrap.bind('down', function(e) { 
	if (e.preventDefault) e.preventDefault();
	window.send_move(3); });
Mousetrap.bind('a', function(e) { 
	if (e.preventDefault) e.preventDefault();
	window.send_move(4); });
Mousetrap.bind('b', function(e) { 
	if (e.preventDefault) e.preventDefault();
	window.send_move(5); });;
Mousetrap.bind('x', function(e) { 
	if (e.preventDefault) e.preventDefault();
	window.send_move(4); });
Mousetrap.bind('z', function(e) { 
	if (e.preventDefault) e.preventDefault();
	window.send_move(5); });
Mousetrap.bind('enter', function(e) { 
	if (e.preventDefault) e.preventDefault();
	window.send_move(7); });
Mousetrap.bind('shift', function(e) { 
	if (e.preventDefault) e.preventDefault();
	window.send_move(6); });
