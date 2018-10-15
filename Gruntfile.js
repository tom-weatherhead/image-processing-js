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
		}
	});

	// Tasks:
	grunt.loadNpmTasks('grunt-eslint');

	// Aliases:
	grunt.registerTask('test', ['eslint']);
	grunt.registerTask('default', ['test']);
};
