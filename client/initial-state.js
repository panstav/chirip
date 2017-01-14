const local = require('store');

const user = local.get('user') || {};

module.exports = {
	user,
	notes: [],
	uniqueTags: [],
	newNote: {
		content: '',
		tags: [],
		createdAt: 0,
		author: {
			name: user.name || 'Stav Geffen',
			handle: user.handle || 'stavgeffen'
		}
	}
};