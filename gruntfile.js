var properties = require('./src/js/game/properties.js');

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-cache-bust');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-pngmin');

  var productionBuild = !!(grunt.cli.tasks.length && grunt.cli.tasks[0] === 'build');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    properties: properties,

    project: {
      src: 'src/js',
      js: '<%= project.src %>/game/{,*/}*.js',
      dest: 'build/js',
      bundle: 'build/js/app.min.js',
      port: properties.port,
      banner:
        '/*\n' +
        ' * <%= properties.title %>\n' +
        ' * <%= pkg.description %>\n' +
        ' *\n' +
        ' * @author <%= pkg.author %>\n' +
        ' * @version <%= pkg.version %>\n' +
        ' * @copyright <%= pkg.author %>\n' +
        ' * @license <%= pkg.license %> licensed\n' +
        ' *\n' +
        ' * Made using Phaser JS Boilerplate' +
        ' <https://github.com/lukewilde/phaser-js-boilerplate>\n' +
        ' */\n'
    },

    connect: {
      dev: {
        options: {
          port: '<%= project.port %>',
          base: './build'
        }
      }
    },

    jshint: {
      files: [
        'gruntfile.js',
        '<%= project.js %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      options: {
        livereload: productionBuild ? false : properties.liveReloadPort
      },
      js: {
        files: '<%= project.dest %>/**/*.js',
        tasks: ['pug']
      },
      pug: {
        files: 'src/templates/*.pug',
        tasks: ['pug']
      },
      stylus: {
        files: 'src/style/*.styl',
        tasks: ['stylus']
      },
      fonts:{
        files: 'src/fonts/**/*',
        tasks: ['copy:fonts']
      },
      images: {
        files: 'src/images/**/*',
        tasks: ['copy:images']
      },
      audio:{
        files: 'src/audio/**/*',
        tasks: ['copy:audio']
      }
    },

    browserify: {
      app: {
        src: ['<%= project.src %>/game/app.js'],
        dest: '<%= project.bundle %>',
        options: {
          transform: ['browserify-shim'],
          watch: true,
          browserifyOptions: {
            debug: !productionBuild
          }
        }
      }
    },

    open: {
      server: {
        path: 'http://localhost:<%= project.port %>'
      }
    },

    cacheBust: {
      options: {
        assets: ['audio/**', 'images/**', 'js/**', 'style/**'],
        baseDir: './build/',
        deleteOriginals: true,
        length: 5
      },
      files: {
        src: ['./build/js/app.min.*', './build/index.html']
      }
    },

    pug: {
      compile: {
        options: {
          data: {
            properties: properties,
            productionBuild: productionBuild
          }
        },
        files: {
          'build/index.html': ['src/templates/index.pug']
        }
      }
    },

    stylus: {
      compile: {
        files: { 'build/style/index.css': ['src/style/index.styl'] },
          options: {
            sourcemaps: !productionBuild
        }
      }
    },

    clean: ['./build/'],

    pngmin: {
      options: {
        ext: '.png',
        force: true
      },
      compile: {
        files: [ { src: 'src/images/*.png', dest: 'src/images/' } ] }
      },

    copy: {
      images: {
        files: [ { expand: true, cwd: 'src/images/', src: ['**'], dest: 'build/images/' } ]
      },
      fonts: {
        files: [ { expand: true, cwd: 'src/fonts/', src: ['**'], dest: 'build/fonts/' } ]
      },
      audio: {
        files: [ { expand: true, cwd: 'src/audio/', src: ['**'], dest: 'build/audio/' } ]
      },
      phaserArcade: {
        files: [ {
          src: ['node_modules/phaser/build/custom/phaser-arcade-physics.js'],
          dest: 'build/js/phaser.js'
        } ]
      },
      phaserArcadeMin: {
        files: [ {
          src: ['node_modules/phaser/build/custom/phaser-arcade-physics.min.js'],
          dest: 'build/js/phaser.js'
        } ]
      },
      phaserP2: {
        files: [ {
          src: ['node_modules/phaser/build/phaser.js'],
          dest: 'build/js/phaser.js'
        } ]
      },
      phaserP2Min: {
        files: [ {
          src: ['node_modules/phaser/build/phaser.min.js'],
          dest: 'build/js/phaser.js'
        } ]
      }
    },

    uglify: {
      options: {
        banner: '<%= project.banner %>'
      },
      dist: {
        files: { '<%= project.bundle %>': '<%= project.bundle %>' }
      }
    },

    compress: {
      options: { archive: '<%= pkg.name %>.zip' },
      zip: { files: [ { expand: true, cwd: 'build/', src: ['**/*'], dest: '<%= pkg.name %>/' } ] },
      cocoon: { files: [ { expand: true, cwd: 'build/', src: ['**/*'] } ] }
    }
  });

  grunt.registerTask('default', [
    'clean',
    'browserify',
    'pug',
    'stylus',
    'copy:images',
    'copy:audio',
    'copy:fonts',
    'copy:phaserArcade',
    'copy:phaserP2',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('build', [
    /*'jshint',
    */'clean',
    'browserify',
    'pug',
    'stylus',
    'uglify',
    'copy:images',
    'copy:fonts',
    'copy:audio',
    'copy:phaserArcadeMin',
    'cacheBust',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('optimise', ['pngmin', 'copy:images']);
  grunt.registerTask('cocoon', ['compress:cocoon']);
  grunt.registerTask('zip', ['compress:zip']);
};
