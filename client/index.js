const createStore = require('redux').createStore;
const watch = require('redux-watch');

const ready = require('document-ready');
const kebabCase = require('kebab-case');

const initialState = require('./initial-state');
const reducers = require('./reducers');
const subscriptions = require('./subscriptions');

const loadFonts = require('./lib/load-fonts');
const populateNotes = require('./lib/populate-notes');

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

	const noteContainer = $('#new-note');
	const tagsContainer = $('#tags-edit');
	const tagsContentElem = $('[contenteditable]', tagsContainer);
	const addTagsButton = $('button', tagsContainer);

	// track textarea typing
	let previousKey = '';
	$('textarea').on('keyup', ev => {
		if (previousKey === 'Enter' && ev.key === 'Control') return dispatch({ type: 'SAVE_NOTE' });
		dispatch({ type: 'TYPE_NOTE', payload: ev.target.value });
		previousKey = ev.key;
	});

	// hide tags input after saving new note
	$('#save-note', noteContainer).on('click', () => {
		dispatch({ type: 'SAVE_NOTE' });
		tagsContentElem.hide().html('');
		addTagsButton.show();
	});

	// tagging
	tagsContentElem.on('keydown', ev => {
		if (ev.key === 'Enter'){
			dispatch({ type: 'ADD_TAG', payload: kebabCase(tagsContentElem.text()) });
			tagsContentElem.text('');
			return false;
		}
	});

	addTagsButton.on('click', () => {
		addTagsButton.hide();
		tagsContentElem.show().focus();
	});

}

function existingNotesCtrl(){

	$('#notes ol')
		.on('click', '[data-action="edit-note"]', ev => getNoteOptionAction(ev, 'EDIT'))
		.on('click', '[data-action="delete-note"]', ev => getNoteOptionAction(ev, 'DELETE'));

	function getNoteOptionAction(ev, typePrefix){
		return dispatch({ type: `${typePrefix}_NOTE`, payload: $(ev.target).parents('[data-id]').data('id') });
	}

}

function registerSubscriptions(){
	$.each(subscriptions, (path, subscription) =>{
		const watcher = watch(getState, path);
		subscribe(watcher(subscription));
	});
}