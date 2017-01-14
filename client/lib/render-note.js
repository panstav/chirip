const timeAgo = require('twitter-timeago');

module.exports = renderNote;

function renderNote(note){

	return `
<article data-note-id="${ note.id }" class="cf mt3 br2 overflow-hidden">
  <div class="fl">
  	<a class="dib ma2 overflow-hidden w3 br2">
	    <img src="https://placekitten.com/g/200/200" class="db h3 w3">
	  </a>
	</div>
	
	<div data-role="note-content" class="fl mt2 f6 f5-ns">
		<span class="mh1">${note.author.name}</span>
		<span data-role="author-handle" class="light-silver">${note.author.handle}</span>
		<div class="fr light-silver mr2">${timeAgo(note.createdAt)}</div>
		
		<p class="lh-copy ml1 mr2">${ note.content }</p>
	</div>
	
	<div data-role="actions-container" class="light-silver overflow-hidden w-100">
			<a data-action="edit-note" title="Edit note" class="dib pl3 pv2 pointer"><img class="db h1 w1" src="/svg/edit.svg"></a>
			<a data-action="delete-note" title="Delete note" class="dib pl3 pv2 pointer"><img class="db h1 w1" src="/svg/delete.svg"></a>
	</div>
		
</article>
`;

}