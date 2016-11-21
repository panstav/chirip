const express =  require('express');
const compression = require('compression');
const morgan = require('morgan');

const isProduction = process.env.NODE_ENV === 'production';

const fourOhFour =    require('./middleware/four-o-four');
const errorHandler =  require('./middleware/error-handler');

module.exports = initServer;

function initServer(){

	// Boing
	const server = express();

	if (!isProduction) server.use(morgan('tiny'));

	// compress everything
	server.use(compression());

	// serve pages
	server.get('/', (req, res) => res.sendFile('index.html', { root: 'public', maxAge: 0 }));
	server.get('/sw.js', (req, res) => res.sendFile('sw.js', { root: 'public', maxAge: 0 }));

	// serve static files
	server.use(express.static('public', { maxAge: isProduction ? 1000*60*60*24*365 : 0 }));

	//---======================================================---
	//--------- Fallback Routes
	//---======================================================---

	// 500
	server.use(errorHandler);

	// 404
	server.use(fourOhFour);

	return server;

}