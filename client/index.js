const createStore = require('redux').createStore;
const watch = require('redux-watch');

const ready = require('document-ready');

const initialState = require('./initial-state');
const reducers = require('./reducers');
const subscriptions = require('./subscriptions');

const modal = require('./lib/modal');
const loadFonts = require('./lib/load-fonts');

const store = createStore(reducers, initialState);
const dispatch = store.dispatch;
const subscribe = store.subscribe;
const getState = store.getState;

ready(() => {
	loadFonts();
	registerSubscriptions();
	homeCtrl();
	registerServiceWorker();
});

function homeCtrl(){

	dispatch({ type: 'LOAD_STORED_DATA' });

	// clicking on new-note fab open new-note window
	$('[data-action="open-new-note-window"]').on('click', () => {
		openNoteModal(initialState.newNote);
	});

	$('main')
		// open note options on note click
		.on('click', '[data-note-id]', openOptions)
		.on('click', '[data-action="edit-note"]', editNote)
		.on('click', '[data-action="delete-note"]', ev => {
			if (confirm('Are you sure?')) return dispatch({ type: `DELETE_NOTE`, payload: {id: getNoteId(ev)} });
		});

	function getNoteId(ev){
		return $(ev.target).parents('[data-note-id]').data('note-id');
	}

	function openOptions(ev){

		const evElem = $(ev.target);
		const noteElem = !evElem.is('[data-note-id]')
			? evElem.parents('[data-note-id]')
			: evElem;

		noteElem.find('[data-role="actions-container"]').data('open', true);

	}

	function editNote(ev){
		// get id at parent elems data
		const id = getNoteId(ev);

		// open modal editing that note
		openNoteModal(getState().notes.find(note => note.id === id));

		dispatch({ type: `EDIT_NOTE`, payload: {id} });
	}

	function openNoteModal(note){

		modal(renderOpenNoteModal(), controller);

		function renderOpenNoteModal(){

			return `
<header class="mv2">
  <button data-action="save-new-note" ${note.content ? '' : 'disabled="disabled"'} class="dib ma2 f6 br2 ba ph3 pv2 bg-white bw0 pointer ml2">
  	Save Note
  </button>
  <span data-role="counter" class="gray pa2">${140-note.content.length}</span>
  <button data-action="cancel-new-note" class="bg-transparent bw0 dib fr ma1 pa2 pointer">
  	<img src="/svg/cancel.svg" class="db"/>
  </button>
</header>

<div class="ph2">
  <textarea placeholder="How are you doing?" class="f4 w-100 h4 mb1 pa2 bn">${note.content}</textarea>
</div>

<div data-role="new-tag-input-container" class="dn cf pt2">
	<div class="fl w-80 ph2">
		<input type="text" placeholder="Add a new tag" class="w-100 pa2 bn">
	</div>
	<div class="fr w-20 ph2">
		<button data-action="add-new-tag" class="bg-white w-100 pa2 bn pointer">Add</button>
	</div>
</div>

<ul data-role="tags-list" class="list ph2 mv3">
	<li class="dib mr2 mb2">
		<button data-action="show-new-tag-input" class="br3 bg-white ph2 pointer pv1 bn pointer">+ New tag</button>
	</li>
	${getState().uniqueTags.map(appliedToCurrentNote).sort(tag => tag.toggled ? -1 : 1).map(renderTagToggle).join('')}
</ul>`;

			function appliedToCurrentNote(tag){
				return { content: tag, toggled: note.tags.includes(tag) };
			}

		}

		function controller(modalElem){

			const newTagContainer = $('[data-role="new-tag-input-container"]', modalElem);

			// track previous key to enable ctrl+enter=save
			let previousKey = '';
			// track textarea typing
			$('textarea', modalElem).on('keyup', ev => {
				if (previousKey === 'Enter' && ev.key === 'Control') return saveNote();
				dispatch({ type: 'TYPE_NOTE', payload: ev.target.value });
				previousKey = ev.key;
			});

			$('[data-action="show-new-tag-input"]', modalElem).on('click', ev => {
				newTagContainer.show();
				$(ev.target).parent().hide();
			});

			$('[data-action="add-new-tag"]', modalElem).on('click', () => {
				const newTagInputElem = $('input', newTagContainer);

				let newTag = newTagInputElem.val().trim().replace(' ', '-').toLowerCase();

				// if new tag input is empty, ignore interaction
				if (!newTag) return;

				// otherwise add it to current note
				dispatch({ type: 'ADD_TAG', payload: {newTag} });
				// clear mini-form and add tag to unique list
				newTagInputElem.val('');
				$('[data-role="tags-list"]').append(renderTagToggle({ content: newTag }));
			});

			$('[data-action="toggle-tag"]', modalElem).on('click', ev => {
				dispatch({ type: 'TOGGLE_TAG', payload: { tag: $(ev.target).text().trim() } });
				// visually toggle button
				$(ev.target).blur().toggleClass('bg-white').toggleClass('hover-bg-white');
			});

			$('[data-action="save-new-note"]', modalElem).on('click', () => {
				saveNote();
			});

			// cancel new note
			$('[data-action="cancel-new-note"]', modalElem).on('click', () => {
				const newNote = getState().newNote;

				// simply close modal if note is new and empty
				if (!newNote.createdAt && !newNote.content) return modal();

				// otherwise confirm with user before discarding
				if (confirm('Are you sure?')){
					modal();
					// also dispatch event to return note-under-edit to list of notes
					dispatch({ type: 'CANCEL_NEW_NOTE' });
				}
			});

			// focus on note editing field
			$('textarea', modalElem).focus();

			function saveNote(){
				modal();
				dispatch({ type: 'SAVE_NOTE' });
			}

		}

		function renderTagToggle(tag){

			return `
<li class="dib mr2 mb2">
	<button data-action="toggle-tag" class="${tag.toggled ? '' : 'hover-'}bg-white br3 ph2 pointer pv1 bw0 pointer">
		${tag.content}
	</button>
</li>`;

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