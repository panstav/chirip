const local = require('store');
const cuid = require('cuid');

const initialState = require('./initial-state');

let cachedNote;

module.exports = reducers;

function reducers(state, action){

	switch (action.type){

		case 'TYPE_NOTE':
			return $.extend(true, {}, state, { newNote: {content: action.payload} });

		case 'CANCEL_NEW_NOTE':
			return cancelNewNote(state);

		case 'SAVE_NOTE':
			return saveNote(state);

		case 'EDIT_NOTE':
			return editNote(state, action.payload.id);

		case 'DELETE_NOTE':
			return deleteNote(state, action.payload.id);
	}

	return state;
}

function cancelNewNote(state){

	if (!cachedNote) return $.extend({}, state, { newNote: initialState.newNote });

	const notes = [...state.notes, cachedNote];
	cachedNote = undefined;

	return $.extend({}, state, { notes, newNote: initialState.newNote });

}

function saveNote(state){

	const date = new Date();
	const id = state.newNote.id || cuid();
	const createdAt = state.newNote.createdAt || date.getTime();

	const newNote = $.extend({}, state.newNote, { id, createdAt });

	const notes = [...state.notes, newNote];
	local.set('notes', notes);

	cachedNote = undefined;
	return $.extend({}, state, { notes, newNote: initialState.newNote });
}

function editNote(state, id){
	const editedNote = state.notes.find(note => note.id === id);
	cachedNote = editedNote;
	return $.extend(deleteNote(state, id), { newNote: editedNote });
}

function deleteNote(state, id){

	const restOfNotes = state.notes.filter(note => note.id !== id);
	local.set('notes', restOfNotes);

	return $.extend({}, state, { notes: restOfNotes });
}