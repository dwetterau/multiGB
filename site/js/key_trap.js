Mousetrap.bind('left', function(e) {
	window.press_left(e);
});
Mousetrap.bind('right', function(e) {
	window.press_right(e);
});
Mousetrap.bind('up', function(e) {
	window.press_up(e);
});
Mousetrap.bind('down', function(e) { 
	window.press_down(e);
});
Mousetrap.bind('a', function(e) { 
	window.press_a(e);
});
Mousetrap.bind('b', function(e) { 
	window.press_b(e);
});
Mousetrap.bind('x', function(e) { 
	window.press_a(e);
});
Mousetrap.bind('z', function(e) { 
	window.press_b(e);
});
Mousetrap.bind('enter', function(e) { 
	window.press_start(e);
});
Mousetrap.bind('shift', function(e) { 
	window.press_select(e);
});


window.press_left = function(e) {
	if (e.preventDefault) e.preventDefault();
	window.send_move(1);
};
window.press_right = function(e) {
	if (e.preventDefault) e.preventDefault();
	window.send_move(0);
};
window.press_up = function(e) {
	if (e.preventDefault) e.preventDefault();
	window.send_move(2);
};
window.press_down = function(e) {
	if (e.preventDefault) e.preventDefault();
	window.send_move(3);
};
window.press_a = function(e) {
if (e.preventDefault) e.preventDefault();
	window.send_move(4);
};
window.press_b = function(e) {
	if (e.preventDefault) e.preventDefault();
	window.send_move(5);
};
window.press_start = function(e) {
	if (e.preventDefault) e.preventDefault();
	window.send_move(7);
};
window.press_select = function(e) {
	if (e.preventDefault) e.preventDefault();
	window.send_move(6);
};
