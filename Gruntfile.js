module.exports = function(grunt) {

  // Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				ignores: ['./node_modules/**']
			},
			all: ['Gruntfile.js', './**/*.js']
		},
		watch: {
			files: ['**/*', '!**/node_modules/**'],
			tasks: ['newer:jshint']
		},
		yuidoc: {
			compile: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.homepage %>',
				options: {
					paths: './',
					outdir: '../383-api-tech-spec/docs/api-docs/',
					// themedir: "./node_modules/yuidoc-bootstrap-theme",
					// helpers: ["./node_modules/yuidoc-bootstrap-theme/helpers/helpers.js"]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	grunt.registerTask('default', ['newer:jshint']);

};
