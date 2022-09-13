module.exports = {
	globDirectory: 'dist/angular-workbox',
	globPatterns: [
		'**/*.{txt,png,ico,html,js,webmanifest,css}'
	],
	globIgnores:[
		"3rdpartylicenses.txt"
	],
	swDest: 'dist/angular-workbox/service-worker.js',
	injectionPoint: "injectionPoint"
};