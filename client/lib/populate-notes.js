const trim = require('lodash.trim');

module.exports = populateNotes;

function populateNotes(notes){

	const notesHtml = notes.length
		? notes.map(renderNote).join('')
		: '<div>No saved notes.</div>';

	$('#notes ol').html(notesHtml);

}

function renderNote(note){
	return trim(`
<li>
	<article data-id="${ note.id }" class="cf bg-washed-green mt3 pa3 br3">
		<span>${ note.content }</span>
		<img data-action="delete-note" class="fr o-0 pointer" src="/svg/delete.svg">
	</article>
</li>
`);
}