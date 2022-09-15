module.exports = {
	globDirectory: 'dist/angular-workbox/',
	globPatterns: [
		'**/*.{txt,png,ico,html,js,webmanifest,css}'
	],
	swDest: 'dist/angular-workbox/service-worker.js',
	swSrc: 'dist/angular-workbox/service-worker.js'
};