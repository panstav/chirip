const webFont = require('webfontloader');

module.exports = loadFonts;

function loadFonts(){

	webFont.load({
		google: { families: ['Open+Sans'] },
		timeout: 2000
	});

}