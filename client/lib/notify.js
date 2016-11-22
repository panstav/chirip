module.exports = notify;

function notify(notification){

	const appearanceMiliseconds = notification.timeout || 2500;
	const notificationElem = $('[data-notification]');

	notificationElem
		.text(notification.string)
		.prepend(renderNotification(notification))
		.data('is-shown', 'true');

	if (notification.sticky) return hideNotification;

	setTimeout(hideNotification ,appearanceMiliseconds);

	function hideNotification(){
		notificationElem.data('is-shown', 'false');
		setTimeout(() => notificationElem.html(''), appearanceMiliseconds);
	}

}

function renderNotification(notification){
	return `
<span 
class="dib w1 h1 mr2 v-mid contain light-blue" 
style="background-image: url(svg/${notification.icon}.svg);"
></span>
`;
}