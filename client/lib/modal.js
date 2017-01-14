module.exports = modal;

function modal(title = 'hidden', html, ctrl){

	const bodyElem = $('body');
	const modalOverlayElem = $('[data-modal-overlay]');
	const modalElem = modalOverlayElem.find('[data-modal]').data('modal', title);

	if (!html){
		bodyElem.css({ overflow: 'initial' });
		modalOverlayElem.hide();
		return $('[data-modal]').html('');
	}

	modalElem.html(html).show()
	// if modal contains an element with close-modal action - close modal onClick
		.find('[data-action="close-modal"]').on('click', ev => modal());

	bodyElem.css({ overflow: 'hidden' });
	modalOverlayElem.show();

	// fire modal controller
	ctrl(modalElem);

}