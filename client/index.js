const ready = require('document-ready');

const createStore = require('redux').createStore;
const watch = require('redux-watch');

const reducers = require('./reducers');
const subscriptions = require('./subscriptions');

const loadFonts = require('./lib/load-fonts');
const populateNotes = require('./lib/populate-notes');

const initialState = {
	notes: [],
	newNote: { content: '' }
};

const store = createStore(reducers, initialState);
const dispatch = store.dispatch;
const subscribe = store.subscribe;
const getState = store.getState;

ready(() => {
	loadFonts();
	registerSubscriptions();
	newNoteCtrl();
	populateNotes(getState().notes);
});

function newNoteCtrl(){

	const textareaElem = $('textarea');

	textareaElem.on('keyup', ev => {
		dispatch({ type: 'TYPE_NOTE', payload: ev.target.value })
	});

	$('#save-note').on('click', ev => dispatch({ type: 'SAVE_NOTE' } ));

}

function registerSubscriptions(){
	for (let path in subscriptions){
		const watcher = watch(getState, path);
		subscribe(watcher(subscriptions[path]));
	}
}