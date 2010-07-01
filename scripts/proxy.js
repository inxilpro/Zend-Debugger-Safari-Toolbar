safari.self.addEventListener("message", function(event) {
	var command = event.name;
	var data = event.message;
	
	// alert('Running: ' + command);
	if (undefined !== data.cookies) {
		for (c in data.cookies) {
			console.log('Set "' + c + '" to "' + data.cookies[c] + '".');
			document.cookie = c + '=' + escape(data.cookies[c]) + '; expires=Mon, 12 Feb 2035 01:00:00 UTC; path=/';
		}
	}
	
	if (true == data.reload) {
		window.location.reload();
	}
}, false);