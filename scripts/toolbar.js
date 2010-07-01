
// Initialization
var ZendDebugger, domReady;
(function setup() {
	domReady = ('loaded' !== document.readyState || 'complete' !== document.readyState);
	if (domReady && undefined !== safari.extension.globalPage.contentWindow.ZendDebugger) {
		ZendDebugger = safari.extension.globalPage.contentWindow.ZendDebugger;
		var buttons = document.getElementsByTagName('button');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener("click", ZendDebugger.toolbarCommand, false);
		}
		return;
	}
	setTimeout(setup, 10);
})();

/*
window.addEventListener("load", function(event) {
	var buttons = document.getElementsByTagName('button');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener("click", safari.extension.globalPage.contentWindow.ZendDebugger.toolbarCommand, false);
	}
	/*
	if (true == safari.extension.settings.debugAll) {
		document.getElementById('debugAll').className = 'toggled';
	}
	*
}, false);

/*
safari.extension.settings.addEventListener("change", function(event) {
	if ('debugAll' == event.key) {
		if (event.newValue == true) {
			document.getElementById('debugAll').className = 'toggled';
		} else {
			document.getElementById('debugAll').className = '';
		}
	}
}, false);
*/