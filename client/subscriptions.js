const trim = require('lodash.trim');

const populateNotes = require('./lib/populate-notes');

module.exports = { newNote, notes };

function newNote(newVal, oldVal){

	const charLeftCount = 140 - newVal.content.length;

	const validCount = charLeftCount > -1;
	const validForSaving = validCount && trim(newVal.content).length !== 0;

	const textareaElem = $('#new-note textarea');
	if (textareaElem.val() !== newVal.content){
		textareaElem.val(newVal.content);
	}

	textareaElem
		.toggleClass('b--red', !validCount);

	$('#counter')
		.text(charLeftCount)
		.toggleClass('red', !validCount);

	$('#save-note')
		.attr('disabled', !validForSaving ? true : null)
		.toggleClass('pointer', validForSaving);

}

function notes(newVal, oldVal){
	if (newVal.length === oldVal.length) return;
	populateNotes(newVal);
}