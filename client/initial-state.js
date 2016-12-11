const local = require('store');

const user = local.get('user');

module.exports = {
	user,
	notes: local.get('notes') || [],
	newNote: {
		content: '',
		tags: [],
		createdAt: 0,
		author: {name: user.name, handle: user.handle}
	}
};