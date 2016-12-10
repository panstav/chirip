module.exports = populateNotes;

function populateNotes(notes){

	const notesHtml = notes.length
		? notes.map(note => `<li>${noteElem(note)}</li>`).join('')
		: '<div>No saved notes.</div>';

	$('#notes ol').html($.trim(notesHtml));

}

function noteElem(note){
	return `
<article data-note-id="${ note.id }" class="cf bg-white mt3 br2 overflow-hidden">
	<div class="f6 light-silver pa2">${ humanDate(note.createdAt) }</div>
	<p class="f4 mh2 pa2">${ note.content }</p>
	<div class="b--light-blue bt bw1"><div data-role="actions-container" class="light-silver overflow-hidden">
			<a data-action="edit-note" class="dib ph3 pv2"><img class="db h1 w1" src="/svg/edit.svg"></a>
			<a data-action="delete-note" class="dib ph3 pv2"><img class="db h1 w1" src="/svg/delete.svg"></a>
	</div></div>
</article>
`;
}

function humanDate(unixTime){
	const date = new Date(unixTime);
	return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear().toString().substr(2)}`;
}