const initServer = require('./server');

initServer().listen(process.env.PORT || 3000, () => {
	console.log('Server is up!');
});