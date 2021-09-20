'use strict';

const meta = require.main.require('./src/meta');
const routesHelpers = require.main.require('./src/routes/helpers');

let app;
const Widget = {
	settings: {},
};

const SUPPORTED_PLATFORMS = ['discord', 'tiktok', 'youtube', 'vk', 'instagram', 'twitter', 'twitch'];


/**
 * Called on `static:app.load`
 */
Widget.init = async function (params) {
	app = params.app;

	const renderAdmin = async (req, res) => {
		res.render(`admin/plugins/social-links`);
	};
	routesHelpers.setupAdminPageRoute(params.router, `/admin/plugins/social-links`, params.middleware, [], renderAdmin);

	Widget.settings = await meta.settings.get('social-links');
};

/**
 * Called on `filter:admin.header.build`
 */
Widget.adminMenu = async function (header) {
	header.plugins.push({
		route: `/plugins/social-links`,
		name: 'Social Links',
	});
	return header;
};

/**
 * Called on `filter:widgets.getWidgets`
 */
Widget.defineWidgets = async function (widgets) {
	return widgets.concat([
		{
			widget: 'aa_social-links_line',
			name: 'Social Links - Line',
			description: 'Display random social link as a line',
			content: await app.renderAsync('admin/widgets/social-links_line', {}),
		},
	]);
};

/**
 * Called on `filter:widget.render:aa_social-links_line`
 */
Widget.renderSocialLinksLineWidget = async function (widget) {
	const items = [];

	for (const PLATFORM of SUPPORTED_PLATFORMS) {
		const value = widget.data[`${PLATFORM}_link`] || Widget.settings[`${PLATFORM}_link`];
		if (value) {
			items.push({ type: PLATFORM, link: value });
		}
	}

	if (!items.length) {
		widget.html = '';
		return widget;
	}

	const randomLink = items[Math.floor(Math.random() * items.length)];
	widget.html = await app.renderAsync('widgets/social-links_line', randomLink);
	return widget;
};

module.exports = Widget;
