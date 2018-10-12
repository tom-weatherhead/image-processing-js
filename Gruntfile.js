// image-processing-js/Gruntfile.js

'use strict';

module.exports = grunt => {
	const packageJsonFilename = 'package.json';
	const packageJsonContents = grunt.file.readJSON(packageJsonFilename);

	grunt.initConfig({
		pkg: packageJsonContents,
		eslint: {
			target: [
				'*.js',
				'src/*.js' /*,
				'test/*.js' */
			]
		},
		nsp: {
			package: packageJsonContents
		}
	});

	// Tasks:
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-nsp');

	// Aliases:
	grunt.registerTask('test', ['eslint', 'nsp']);
	grunt.registerTask('default', ['test']);
};
