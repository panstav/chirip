module.exports = populateNotes;

function populateNotes(notes){

	const notesHtml = notes.length
		? notes.map(renderNote).join('')
		: '<div>No saved notes.</div>';

	$('#notes ol').html($.trim(notesHtml));

}

function renderNote(note){
	return `
<li>
	<article data-id="${ note.id }" class="cf bg-white mt3 pa3 br2">
		<div class="fr ml2 mb2 gray f6">${ humanDate(note.createdAt) }</div>
		<div class="options fr o-0 mr1">
			<img data-action="edit-note" class="w1 h1 ml1 pointer" src="/svg/edit.svg">
			<img data-action="delete-note" class="w1 h1 ml1 pointer" src="/svg/delete.svg">
		</div>
		<p>${ note.content }</p>
	</article>
</li>
`;
}

function humanDate(unixTime){
	const date = new Date(unixTime);
	return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear().toString().substr(2)}`;
}