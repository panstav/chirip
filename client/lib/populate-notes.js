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
		<span>${ note.content.replace('\n', '<br>') }</span>
		<div class="options fr o-0">
			<img data-action="edit-note" class="w1 h1 ml1 pointer" src="/svg/edit.svg">
			<img data-action="delete-note" class="w1 h1 ml1 pointer" src="/svg/delete.svg">
		</div>
	</article>
</li>
`;
}