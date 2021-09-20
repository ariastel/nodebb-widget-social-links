'use strict';

define('admin/plugins/social-links', ['settings'], function (settings) {
	var ACP = {};

	ACP.init = function () {
		settings.load('social-links', $('.social-links-settings'));
		$('#save').on('click', saveSettings);
	};

	function saveSettings() {
		settings.save('social-links', $('.social-links-settings'), function () {
			app.alert({
				type: 'success',
				alert_id: 'social-links-saved',
				title: 'Settings Saved',
				message: 'Please reload your NodeBB to apply these settings',
				clickfn: function () {
					socket.emit('admin.restart');
				},
			});
		});
	}

	return ACP;
});
