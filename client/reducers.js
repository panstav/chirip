const local = require('store');
const cuid = require('cuid');

const initialState = require('./initial-state');

let cachedNote;

module.exports = reducers;

function reducers(state, action){

	switch (action.type){

		case 'LOAD_STORED_DATA':
			return loadStoredData(state);

		case 'TYPE_NOTE':
			return $.extend(true, {}, state, { newNote: {content: action.payload} });

		case 'TOGGLE_TAG':
			return toggleTag(state, action.payload.tag);

		case 'ADD_TAG':
			return addTag(state, action.payload.newTag);

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

function loadStoredData(state){

	const notes = local.get('notes') || [];
	local.set('notes', notes);

	const uniqueTags = notes
		.reduce((tags, note) => [...tags, ...note.tags.filter(tag => !tags.includes(tag))], [])
		.sort((a,b) => a < b ? 1 : -1);

	return $.extend({}, state, {uniqueTags, notes});

}

function toggleTag(state, tag){

	const tags = state.newNote.tags.includes(tag)
		? state.newNote.tags.filter(toggledTag => toggledTag !== tag)
		: [...state.newNote.tags, tag];

	const newNote = $.extend({}, state.newNote, {tags});
	return $.extend({}, state, {newNote});

}

function addTag(state, newTag){

	// ignore if newly added tag is present on newNote
	if (state.newNote.tags.includes(newTag)) return state;

	// otherwise handle it the same as toggling a tag
	return toggleTag(state, newTag);

}

function cancelNewNote(state){

	if (!cachedNote) return $.extend({}, state, { newNote: initialState.newNote });

	const notes = [...state.notes, cachedNote];
	local.set('notes', notes);
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

	// update uniqueTags
	const uniqueTags = [
		...state.uniqueTags,
		...newNote.tags.filter(tag => !state.uniqueTags.includes(tag))
	];

	return $.extend({}, state, { notes, uniqueTags, newNote: initialState.newNote });
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