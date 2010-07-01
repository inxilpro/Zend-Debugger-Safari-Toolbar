
// Zend Debugger
var ZendDebugger = {
	
	// Validates button, toggles toolbar, etc (on system change)
	validate: function(event) {
		console.log(event);
		var settings = ZendDebugger.getDomainSettings();
		var toolbar = ZendDebugger.getToolbar(event.target.browserWindow);
		var button = event.target;
		
		if (true == settings.showToolbar) {
			button.image = safari.extension.baseURI + 'images/button-on.png';
			button.toolTip = 'Hide Zend Debugger Toolbar';
			toolbar.show();
		} else {
			button.image = safari.extension.baseURI + 'images/button-off.png';
			button.toolTip = 'Show Zend Debugger Toolbar';
			toolbar.hide();
		}
	},
	
	buttonCommand: function(event) {
		var settings = ZendDebugger.getDomainSettings();
		if (false == settings.showToolbar) {
			settings.showToolbar = true;
		} else {
			settings.showToolbar = false;
		}
		
		ZendDebugger.setDomainSettings(settings);
		ZendDebugger.validate(event);
	},
	
	// Get settings for a given domain
	getDomainSettings: function(domain) {
		if (undefined == domain) {
			domain = ZendDebugger.getActiveDomain();
		}
		
		var settings = localStorage.getItem('domains:' + domain);
		if (null == settings) {
			settings = {
				showToolbar: false,
				debugAll: false
			};
		} else {
			settings = JSON.parse(settings);
		}
		
		return settings;
	},
	
	// Set settings for a given domain
	setDomainSettings: function(settings, domain) {
		if (undefined == domain) {
			domain = ZendDebugger.getActiveDomain();
		}
		
		if (undefined == settings.showToolbar || undefined == settings.debugAll) {
			throw "You must define all default settings!";
		}
		
		try {
			localStorage.setItem('domains:' + domain, JSON.stringify(settings));
			return true;
		} catch (e) {
			return false;
		}
	},
	
	// Gets a toolbar object
	getToolbar: function(browserWindow) {
		if (undefined == browserWindow) {
			browserWindow = safari.application.activeBrowserWindow;
		}
		
		for (var i = 0; i < safari.extension.bars.length; i++) {
			if ('zend_debugger' == safari.extension.bars[i].identifier && browserWindow == safari.extension.bars[i].browserWindow) {
				return safari.extension.bars[i];
			}
		}
		
		return false;
	},
	
	// Get currently active domain
	getActiveDomain: function() {
		return safari.application.activeBrowserWindow.activeTab.url.match(/:\/\/(.[^/]+)/)[1];
	}
};

// Initialization
safari.application.addEventListener("validate", ZendDebugger.validate, false);
safari.application.addEventListener("command", ZendDebugger.buttonCommand, false);