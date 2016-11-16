const trim = require('lodash.trim');

const populateNotes = require('./lib/populate-notes');

module.exports = { newNote, notes };

function newNote(newVal, oldVal){

	const charLeftCount = 140 - newVal.content.length;

	const validContent = trim(newVal.content).length !== 0;
	const validCount = charLeftCount > -1;
	const validForSaving = validCount && validContent;

	$('#new-note textarea')
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
	$('#new-note textarea').val('');
	populateNotes(newVal);
}