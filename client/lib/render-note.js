module.exports = renderNote;

function renderNote(note){

	return `
<article class="cf mt3 br2 overflow-hidden">
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
		
</article>
<div data-role="actions-container" class="fr light-silver overflow-hidden">
	<a data-action="edit-note" title="Edit note" class="dib pl1 pv2 pointer"><img class="db h1 w1" src="/svg/edit.svg"></a>
	<a data-action="delete-note" title="Delete note" class="dib pl2 pv2 pointer"><img class="db h1 w1" src="/svg/delete.svg"></a>
</div>
`;

}

function timeAgo(timestamp){

	// Times in milliseconds
	const second = 1e3
		, minute = 6e4
		, hour = 36e5
		, day = 864e5
		, week = 6048e5;

	if (timestamp instanceof Date) {
		timestamp = timestamp.getTime();
	}

	if (typeof timestamp === 'string') {
		timestamp = new Date(timestamp).getTime();
	}

	const diff = Math.abs(timestamp - Date.now());

	if (diff <= second) {
		return '1s';
	} else if (diff < minute) {
		return Math.floor(diff / 1000) + 's';
	} else if (diff < hour) {
		return Math.floor(diff / 1000 / 60) + 'm';
	} else if (diff < day) {
		return Math.floor(diff / 1000 / 3600) + 'h';
	} else {
		if (diff < week) {
			return Math.floor(diff / 1000 / 86400) + 'd';
		} else {
			const d = new Date(timestamp);
			return (d.getDate()) + '/' + (d.getMonth() + 1) + '/' + d.getFullYear().toString().substr(2);
		}
	}

}
