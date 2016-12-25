const renderNote = require('./lib/render-note');

module.exports = { notes, newNote };

function notes(newVal, oldVal){

	$('main').html(getNotesTemplate(!!newVal.length));

	function getNotesTemplate(gotNotes){
		if (!gotNotes) return '<div class="ma2">No saved notes.</div>';

		return newVal.map(note => `<ol data-role="note-list" class="list pl0">
	<li class="pb3">${renderNote(note)}</li>
</ol>`).join('');

	}

}

function newNote(newVal, oldVal){

	// bind textarea
	const textareaElem = $('[data-window="new-note"] textarea');
	// if new state of newNote is different from the one present, apply it
	if (textareaElem.val() !== newVal.content) textareaElem.val(newVal.content);

	// calculate how many charactes are left till hard limit
	const charLeftCount = 140 - newVal.content.length;
	// check whether characters num is over limit
	const validCount = charLeftCount > -1;
	// check if tweet is valid for saving - not empty
	const validForSaving = validCount && $.trim(newVal.content).length !== 0;

	// mark textarea's border if its content isn't valid
	textareaElem
		.toggleClass('b--red', !validCount);

	// mark character counter if tweet content went over the hard limit
	$('[data-role="counter"]')
		.text(charLeftCount)
		.toggleClass('red', !validCount);

	// disable the save button if newNote is invalid
	$('[data-action="save-new-note"]')
		.attr('disabled', !validForSaving ? true : null)
		.toggleClass('pointer', validForSaving);

}