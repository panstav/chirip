module.exports = populateNotes;

function populateNotes(notes){

	const notesHtml = notes.length
		? notes.map(renderNote).join('')
		: '<div>No saved notes.</div>';

	$('#notes ol').html(notesHtml);

}

function renderNote(note){
	return `<li><article class="bg-washed-green mt3 pa3 br3">${ note.content }</article></li>`;
}