module.exports = function(grunt) {
	require('time-grunt')(grunt);

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// uglify config
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		},

		// bower requirejs config
		bowerRequirejs: {
			target: {
				rjsConfig: 'js/config.js',
				options: {
					'exclude-dev': true,
                    exclude: ['markdown']
				}
			}
		},

		// shell command config
		shell: {
			jekyllBuild: {
				command: 'jekyll build --config _config.yml,_' + process.env.JEKYLL_ENV + '-config.yml'
			},
			jekyllServe: {
				command: 'jekyll serve --config _config.yml,_' + process.env.JEKYLL_ENV + '-config.yml'
			}
		},

		// watch for file changes
		watch: {
			sass: {
				files: ['_sass/**/*.{scss,sass}'],
				tasks: ['sass']
			}
		},

        // sass (libsass) config
        sass: {
            options: {
                sourceMap: true,
                relativeAssets: false,
                outputStyle: 'expanded',
                sassDir: '_sass',
                cssDir: '_site/css'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '_sass/',
                    src: ['**/*.{scss,sass}'],
                    dest: '_site/css',
                    ext: '.css'
                }]
            }
        },

        // run tasks in parallel
        concurrent: {
            serve: [
                'sass',
                'watch',
                'shell:jekyllServe',
                'karma:unit'
            ],
            options: {
                logConcurrentOutput: true
            }
        },

        jshint: {
        	all: ['Gruntfile.js', '_site/js/**/*.js']
        },

        bootlint: {
        	files: ['_site/*.html', '_site/rsvp/*.html', '_site/photos/*.html']
        },

        karma: {
        	unit: {
        		configFile: 'karma.conf.js'
        	},
            continuous: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
	});

	grunt.registerTask('serve', [ 'concurrent:serve' ]);
	grunt.registerTask('build', [ 'shell:jekyllBuild', 'sass', 'bowerRequirejs', 'jshint', 'bootlint', 'karma:continuous']);

	grunt.registerTask('default', ['build']);
};
