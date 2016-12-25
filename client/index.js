const createStore = require('redux').createStore;
const watch = require('redux-watch');

const ready = require('document-ready');

const initialState = require('./initial-state');
const reducers = require('./reducers');
const subscriptions = require('./subscriptions');

const modal = require('./lib/modal');
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
	homeCtrl();
	registerServiceWorker();
});

function homeCtrl(){

	// clicking on new-note fab open new-note window
	$('[data-action="open-new-note-window"]').on('click', () => {
		openNoteModal(initialState.newNote);
	});

	$('main ol')
		// open note options on note click
		.on('click', '[data-note-id]', openOptions)
		.on('click', '[data-action="edit-note"]', ev => {
			const id = getNoteId(ev);
			openNoteModal(getState().notes.find(note => note.id === id));
			dispatch({ type: `EDIT_NOTE`, payload: {id} });
		})
		.on('click', '[data-action="delete-note"]', ev => {
			if (confirm('Are you sure?')) return dispatch({ type: `DELETE_NOTE`, payload: {id:getNoteId(ev)} });
		});

	function openOptions(ev){

		const evElem = $(ev.target);
		const noteElem = !evElem.is('[data-note-id]')
			? evElem.parents('[data-note-id]')
			: evElem;

		noteElem.find('[data-role="actions-container"]').data('open', true);

	}

	function getNoteId(ev){
		return $(ev.target).parents('[data-note-id]').data('note-id');
	}

	function openNoteModal(note){

		modal(renderNoteModal(note, getAllTags()), controller);

		function renderNoteModal(note, allTags){

			return `
<header class="mv2">
  <button data-action="save-new-note" ${disabledIfEmpty()} class="dib ma2 f6 br2 ba ph3 pv2 bg-white bw0 pointer ml2">
  	Save Note
  </button>
  <span data-role="counter" class="gray pa2">${140-note.content.length}</span>
  <button data-action="cancel-new-note" class="bg-transparent bw0 dib fr ma1 pa2 pointer">
  	<img src="/svg/cancel.svg" data-action="close-modal" class="db"/>
  </button>
</header>
<div class="ph2">
  <textarea placeholder="How are you doing?" class="f4 w-100 h4 mb1 pa2 bn">${note.content}</textarea>
</div>
<ul data-role="available-tags" class="list ph2 mv2">
	${allTags.map(renderTag).join('')}
</ul>`;

			function disabledIfEmpty(){
				return note.content ? '' : 'disabled="disabled"';
			}

		}

		function renderTag(tag){

			return `<li class="dib mr3 mb3">
	<button class="br3 hover-bg-white ph2 pointer pv1 bw0">${tag}</button>
</li>`;

		}

		function controller(modalElem){

			// track previous key to enable ctrl+enter=save
			let previousKey = '';
			// track textarea typing
			$('textarea', modalElem).on('keyup', ev => {
				if (previousKey === 'Enter' && ev.key === 'Control') return saveNote();
				dispatch({ type: 'TYPE_NOTE', payload: ev.target.value });
				previousKey = ev.key;
			});

			// hide tags input after saving new note
			$('[data-action="save-new-note"]', modalElem).on('click', saveNote);

			// cancel new note
			$('[data-action="cancel-new-note"]', modalElem).on('click', () => {
				modal();
				dispatch({ type: 'TYPE_NOTE', payload: '' });
			});

			// focus on note editing field
			$('textarea', modalElem).focus();

			function saveNote(){
				modal();
				dispatch({ type: 'SAVE_NOTE' });
			}

		}

		function getAllTags(){

			return getState().notes
				.reduce(uniqueTags, [])
				.sort((a,b) => a < b ? 1 : -1);

			function uniqueTags(tags, note){

				note.tags.forEach(tag => {
					if (!tags.includes(tag)) tags.push(tag);
				});

				return tags;
			}

		}

	}

}

function registerSubscriptions(){
	$.each(subscriptions, (path, subscription) =>{
		const watcher = watch(getState, path);
		subscribe(watcher(subscription));
	});
}

function registerServiceWorker(){

	if ('serviceWorker' in navigator){
		navigator.serviceWorker.register('/sw.js')
			.catch(err => console.log('SW error!', err));
	}

}