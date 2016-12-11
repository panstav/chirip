const local = require('store');

module.exports = {
	user: local.get('user'),
	notes: local.get('notes') || [],
	newNote: { content: '', tags: [], createdAt: 0 }
};