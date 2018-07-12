module.exports = function(grunt) {

  'use strict';
  // Default port
  var LIVERELOAD_PORT = 35729;

  // Project configuration.
  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'scripts/vendor/jquery-3.3.1.min.js',
          // 'scripts/vendor/jquery-sortable-min.js',
          'scripts/vendor/dragula.min.js',
          'scripts/main.js'

          // 'scripts/vendor/dragon-drop.js'
          // 'dragondrop.js'


        ],
        dest: 'built.min.js',
      },
    },
    uglify: {
      build: {
        src: 'public/concat.js',
        dest: 'public/concat.js'
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: 'public',
          livereload: LIVERELOAD_PORT
        }
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'scss',
          src: ['*.scss'],
          dest: 'public/styles',
          ext: '.css'
        }]
      }
    },
    postcss: {
      options: {
        map: true, // inline sourcemaps
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
        ]
      },
      dist: {
        src: 'public/styles/*.css'
      }
    },
    watch: {
      scripts: {
        files: ['scripts/*'],
        tasks:  ['concat', 'uglify'],
        options: {
          livereload: LIVERELOAD_PORT
        }
      },
      css: {
        files: ['scss/*.scss'],
        tasks: ['sass', 'postcss'],
        options: {
          livereload: LIVERELOAD_PORT,
        },
      },
    },
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['connect', 'watch']);
};
