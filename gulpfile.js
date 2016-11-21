const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const guid = require('random-guid');

const isProduction = process.env.NODE_ENV === 'production';
const version = require('./package.json').version;

gulp.task('clean', () => {

	const publicFiles = [
		'!public/.gitignore', 'public/*'
	];

	return gulp.src(publicFiles, { read: false })
		.pipe(plugins.clean({ force: true }));

});

gulp.task('icons', () => {

	return gulp.src('client/icons/*')
		.pipe(gulp.dest('public/icons'));

});

gulp.task('svg', () => {

	return gulp.src('client/svg/*')
		.pipe(gulp.dest('public/svg'));

});

gulp.task('static', ['icons', 'svg'], () => {

	const sourcePaths = [
		'client/manifest.json',
		'client/zepto.min.js',
		'node_modules/tachyons/css/tachyons.min.css'
	];

	// copy pastes
	return gulp.src(sourcePaths)
		.pipe(gulp.dest('public'));

});

gulp.task('css', () => {

	const sassOptions = isProduction
		? { outputStyle: 'compressed' }
		: { outputStyle: 'nested', errLogToConsole: true, sourceComments : 'normal' };

	return gulp.src('client/index.sass')
		.pipe(plugins.sass(sassOptions))
		.pipe(plugins.autoprefixer({ browsers: ['> 1%', 'ie > 8'] }))
		.pipe(plugins.rename({ basename: isProduction ? version : 'styles' }))
		.pipe(gulp.dest('public'));

});

gulp.task('service-worker', () => {

	// copy pastes
	return gulp.src('client/sw.js')
		.pipe(plugins.replace('$JSBASENAME$', isProduction ? version : 'scripts'))
		.pipe(plugins.replace('$CSSBASENAME$', isProduction ? version : 'styles'))
		.pipe(gulp.dest('public'));

});

gulp.task('javascript', ['service-worker'], () => {

	return gulp.src('client/index.js')
		.pipe(plugins.browserify({ transform: ['babelify'] }))
		.pipe(plugins.if(isProduction, plugins.uglify()))
		.pipe(plugins.rename({ basename: isProduction ? version : 'scripts' }))
		.pipe(gulp.dest('public'));

});

gulp.task('html', () => {

	return gulp.src('client/index.pug')
		.pipe(plugins.pug({ locals: {version, isProduction}, pretty: !isProduction }))
		.pipe(gulp.dest('public'));

});

gulp.task('build', plugins.sequence('clean', 'static', 'css', 'javascript', 'html'));

gulp.task('watch', () => {
	gulp.watch('client/**/*.*', ['css', 'javascript', 'html']);
});

gulp.task('build-zepto', () => {

	return gulp.src('index.js', { read: false })
		.pipe(plugins.shell([
			`MODULES="${process.env.ZEPTO_MODULES || 'zepto event'}" cd node_modules/zepto && npm run dist && cp dist/zepto.min.js ../../client`
		]));

});