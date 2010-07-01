
// Zend Debugger (reference)
const ZendDebugger = safari.extension.globalPage.contentWindow.ZendDebugger;

// Zend Debugger Toolbar
var ZendDebuggerToolbar = {
	sendMessage: function(event) {
		console.log(event.target.id);
		// ZendDebugger[event.target.id](event);
	}
};

// Initialization
window.addEventListener("load", function(event) {
	var buttons = document.getElementsByTagName('button');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener("click", ZendDebuggerToolbar.sendMessage, false);
	}
	/*
	if (true == safari.extension.settings.debugAll) {
		document.getElementById('debugAll').className = 'toggled';
	}
	*/
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