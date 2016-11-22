const local = require('store');

module.exports = {
	offlineAvailable: false,
	notes: local.get('notes') || [],
	newNote: { content: '', tags: [] }
};