const notify = require('./lib/notify');
const populateNotes = require('./lib/populate-notes');

module.exports = { offlineAvailable, newNote, notes };

function newNote(newVal, oldVal){

	// calculate how many charactes are left till hard limit
	const charLeftCount = 140 - newVal.content.length;

	// check whether tags have changed
	const sortedOldTags = oldVal.tags.sort();
	const tagsChanged = (!newVal.tags.length && oldVal.tags.length)
		|| !newVal.tags.sort().every((newTag, index) => {
			return newTag === sortedOldTags[index];
		});

	// check whether characters num is over limit
	const validCount = charLeftCount > -1;
	// check if tweet is valid for saving - not empty
	const validForSaving = validCount && $.trim(newVal.content).length !== 0;

	// bind textarea
	const textareaElem = $('#new-note textarea');
	if (textareaElem.val() !== newVal.content) textareaElem.val(newVal.content);

	if (tagsChanged){
		const tagsContainer = $('#tags-edit');

		// bind tags
		$('#new-tags', tagsContainer).html(newVal.tags.map(tag => {
			return `<span class="dib ph2 pv1 bg-black-10 br2 mr2">${tag}</span>`;
		}).join(''));

		// check if all tags are new
		if (!oldVal.tags.length){
			 // show tags input instead of the button
			$('button', tagsContainer).hide();
			$('[contenteditable]', tagsContainer).show();
		}
	}

	// mark textarea's border if its content isn't valid
	textareaElem
		.toggleClass('b--red', !validCount);

	// mark character counter if tweet content went over the hard limit
	$('#counter')
		.text(charLeftCount)
		.toggleClass('red', !validCount);

	// disable the save button if newNote is invalid
	$('#save-note')
		.attr('disabled', !validForSaving ? true : null)
		.toggleClass('pointer', validForSaving);

}

function notes(newVal, oldVal){
	if (newVal.length === oldVal.length) return;
	populateNotes(newVal);
}

function offlineAvailable(newVal){
	if (newVal !== true) return;
	notify({ string: 'Offline mode is now available!', icon: 'offline' });
}