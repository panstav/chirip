const humanDate = require('human-date');

module.exports = populateNotes;

function populateNotes(notes){

	const notesHtml = notes.length
		? notes.map(note => `<li class="pb3">${noteElem(note)}</li>`).join('')
		: '<div>No saved notes.</div>';

	$('main ol').html($.trim(notesHtml));

}

function noteElem(note){

	return `
<article data-note-id="${ note.id }" class="cf mt3 br2 overflow-hidden">
  <div class="fl">
  	<a class="dib ma2 overflow-hidden w3 br2">
	    <img src="https://placekitten.com/g/200/200" class="db h3 w3">
	  </a>
	</div>
	<div data-role="note-content" class="fl mt2">
		
		<span class="fw6 mr2">${note.author.name}</span>
		<span data-role="author-handle" class="light-silver">${note.author.handle}</span>
		<div class="fr f6 light-silver mr2">${getRelativeTime(note.createdAt)}</div>
		
		<p class="f4 mh3">${ note.content }</p>
		<div class="b--light-blue bt bw1"><div data-role="actions-container" class="light-silver overflow-hidden">
				<a data-action="edit-note" class="dib pl3 pv2"><img class="db h1 w1" src="/svg/edit.svg"></a>
				<a data-action="delete-note" class="dib pl3 pv2"><img class="db h1 w1" src="/svg/delete.svg"></a>
		</div></div>
		
	</div>
</article>
`;

	function getRelativeTime(createdAt){
		const relativeTime = humanDate.relativeTime(new Date(createdAt));
		return relativeTime === ' ago' ? 'Just now' : relativeTime;
	}

}