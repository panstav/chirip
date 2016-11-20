const local = require('store');

module.exports = {
	notes: local.get('notes') || [],
	newNote: { content: '', tags: [] }
};