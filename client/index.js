const ready = require('document-ready');
const local = require('store');

const createStore = require('redux').createStore;
const watch = require('redux-watch');

const reducers = require('./reducers');
const subscriptions = require('./subscriptions');

const loadFonts = require('./lib/load-fonts');
const populateNotes = require('./lib/populate-notes');

const initialState = {
	notes: local.get('notes') || [],
	newNote: { content: '' }
};

const store = createStore(reducers, initialState);
const dispatch = store.dispatch;
const subscribe = store.subscribe;
const getState = store.getState;

ready(() => {
	loadFonts();
	populateNotes(getState().notes);
	registerSubscriptions();
	newNoteCtrl();
	existingNotesCtrl();
});

function newNoteCtrl(){

	const textareaElem = $('textarea');

	textareaElem.on('keyup', ev => {
		dispatch({ type: 'TYPE_NOTE', payload: ev.target.value })
	});

	$('#save-note').on('click', ev => {
		dispatch({ type: 'SAVE_NOTE' });
	});

}

function existingNotesCtrl(){

	$('#notes ol')
		.on('click', '[data-action="edit-note"]', ev => noteOption(ev, 'EDIT'))
		.on('click', '[data-action="delete-note"]', ev => noteOption(ev, 'DELETE'));

	function noteOption(ev, typePrefix){
		return dispatch({ type: `${typePrefix}_NOTE`, payload: $(ev.target).parents('[data-id]').data('id') });
	}

}

function registerSubscriptions(){
	for (let path in subscriptions){
		const watcher = watch(getState, path);
		subscribe(watcher(subscriptions[path]));
	}
}