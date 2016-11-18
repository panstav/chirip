const local = require('store');
const cuid = require('cuid');

module.exports = reducers;

function reducers(state, action){

	switch (action.type){

		case 'TYPE_NOTE':
			return typeNote(state, action.payload);

		case 'SAVE_NOTE':
			return saveNote(state);

		case 'DELETE_NOTE':
			return deleteNote(state, action.payload);
	}

	return state;
}

function typeNote(state, content){
	return $.extend({}, state, { newNote: { content } });
}

function saveNote(state){

	const newNote = state.newNote;
	newNote.id = cuid();

	const notes = [...state.notes, newNote];
	local.set('notes', notes);

	return $.extend({}, state, { notes, newNote: {content:''} });
}

function deleteNote(state, id){

	const restOfNotes = state.notes.filter(note => note.id !== id);
	local.set('notes', restOfNotes);

	return $.extend({}, state, { notes: restOfNotes });
}