const renderNote = require('./lib/render-note');

module.exports = { notes, newNote };

function notes(newVal, oldVal){

	const notesHtml = newVal.length
		? newVal.map(note => `<li class="pb3">${renderNote(note)}</li>`).join('')
		: '<div>No saved notes.</div>';

	$('main ol').html(notesHtml);
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