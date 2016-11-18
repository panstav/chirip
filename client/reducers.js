const local = require('store');
const merge = require('lodash.merge');

module.exports = reducers;

function reducers(state, action){

	switch (action.type){

		case 'TYPE_NOTE':
			return typeNote(state, action.payload);

		case 'SAVE_NOTE':
			return saveNote(state);
	}

	return state;
}

function typeNote(state, content){
	return merge({}, state, { newNote: { content } });
}

function saveNote(state){
	const notes = [state.newNote, ...state.notes];
	local.set('notes', notes);
	return merge({}, state, {notes, newNote: {content:''}});
}