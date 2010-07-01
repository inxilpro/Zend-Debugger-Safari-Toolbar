
// Zend Debugger
var ZendDebugger = {
	// Debug settings
	debugSettings: null,
	
	// Validates button, toggles toolbar, etc (on system change)
	validate: function(event) {
		var settings = ZendDebugger.getDomainSettings();
		var toolbar = ZendDebugger.getToolbar(event.target.browserWindow);
		var button = event.target;
		
		// Show or Hide Toolbar
		if (true == settings.showToolbar) {
			button.image = safari.extension.baseURI + 'images/button-on.png';
			button.toolTip = 'Hide Zend Debugger Toolbar';
			button.badge = 0;
			toolbar.show();
		} else {
			button.image = safari.extension.baseURI + 'images/button-off.png';
			button.toolTip = 'Show Zend Debugger Toolbar';

			/*
			var debuggerPresent = document.cookie.indexOf('ZDEDebuggerPresent');
			console.log('Debugger present: ' + debuggerPresent);
			if (-1 != debuggerPresent) {
				button.badge = 1;
			}
			*/

			toolbar.hide();
		}
		
		// TODO: Debug All Toggle
	},
	
	// Handle button click
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
	
	// Handle toolbar command
	toolbarCommand: function(event) {
		var command = event.target.id;
		if (undefined !== ZendDebugger[command]) {
			return ZendDebugger[command](event);
		}
		
		alert('Command "' + command + '" not yet configured.');
	},
	
	debugCurrent: function(event) {	
 		var c = ZendDebugger.getDebugSettings();
		if (false == c) {
			alert('Please check the Zend Debugger settings in Safari preferences and then try again.');
			return;
		}
		
		c['start_debug'] = 1;
		c['send_debug_header'] = 1;
		c['send_sess_end'] = 1;
		c['debug_jit'] = 1;
		c['debug_session_id'] = (Math.floor(Math.random() * 147483648) + 2000);
		// TODO: set original_url
		// TODO: if profiling, set start_profile=1, debug_coverage=1
	
		c['debug_stop'] = (safari.extension.settings.breakOnFirstLine ? 1 : 0);
		if (false == safari.extension.settings.debugLocalCopy) {
			c['use_remote'] = 1;
		} else {
			c['no_remote'] = 1;
		}
		
		var message = {
			'cookies': c,
			'reload': true
		};
		
		if (undefined == safari.application.activeBrowserWindow.activeTab.page) {
			alert('You cannot debug static files.');
			return;
		}
		
		safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(event.target.id, message);
		// event.view.safari.self.browserWindow.activeTab.page.dispatchMessage(event.target.id, message);
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
	
	// Get debug settings
	// TODO: Add SSL support
	getDebugSettings: function() {
		if (null == ZendDebugger.debugSettings) {
			ZendDebugger.debugSettings = {};
			const s = safari.extension.settings;
			
			// Auto-detect, if necessary
			if ('auto' == s.detectMethond) {
				if (!ZendDebugger.autoDetectSettings()) {
					alert('Could not auto-detect Zend Debugger settings at port "' + safari.extension.settings.broadcastPort + '".');
					return false;
				}
			} else {
				ZendDebugger.debugSettings['debug_port'] = s.debuggerPort;
				ZendDebugger.debugSettings['debug_host'] = s.debuggerIpAddress;
				ZendDebugger.debugSettings['debug_fastfile'] = 0;
			}
		}
		
		return ZendDebugger.debugSettings;
	},
	
	// Auto-detect settings
	autoDetectSettings: function(settings) {
		if (undefined == settings) {
			settings = ZendDebugger.debugSettings;
		}
		
		try {
			var url = "http://127.0.0.1:" + safari.extension.settings.broadcastPort;
			var req = new XMLHttpRequest();
			req.open("GET", url, false);
			req.send(null);
			if (200 != req.status) {
				return false;
			}
			
			var items = req.responseText.split('&');
			for (var i = 0; i < items.length; i++) {
				if(-1 == items[i].indexOf("=")) {
					continue;
				}
				var values = items[i].split('=');
				if ('debug_host' == values[0]) {
					settings[values[0]] = values[1];
				} else {
					settings[values[0]] = parseInt(values[1]);
				}
			}
			return settings;			
		} catch(e) {
			return false;
		}
	},
	
	// Reset necessary properties when extension settings change
	settingsChanged: function(event) {
		ZendDebugger.debugSettings = null;
	},
	
	// Get currently active domain
	getActiveDomain: function() {
		if (undefined == safari.application.activeBrowserWindow.activeTab.url) {
			return '';
		}
		
		return safari.application.activeBrowserWindow.activeTab.url.match(/:\/\/(.[^/]+)/)[1];
	}
};

// Initialization
safari.application.addEventListener("validate", ZendDebugger.validate, false);
safari.application.addEventListener("command", ZendDebugger.buttonCommand, false);
safari.extension.settings.addEventListener("change", ZendDebugger.settingsChanged, false);

