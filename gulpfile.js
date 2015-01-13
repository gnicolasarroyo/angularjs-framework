'use strict';

var gulp 	= require('gulp'),
	header  = require('gulp-header'),
	concat  = require('gulp-concat'),
	uglify  = require('gulp-uglify'),
	coffee 	= require('gulp-coffee'),
	less 	= require('gulp-less'),
	gutil   = require('gulp-util'),
	karma 	= require('karma').server,
	pkg 	= require('./package.json'),
	banner 	= [],
	path 	= {};


banner = ['/**',
' * <%= pkg.name %> - <%= pkg.description %>',
' * @version v<%= pkg.version %>',
' * @link    <%= pkg.homepage %>',
' * @author  <%= pkg.author.name %> (<%= pkg.author.site %>)',
' * @license <%= pkg.license %>',
' */',
''].join('\n');

path = {
	"styles": {
		"name": pkg.name + ".less",
		"source": [
			"./src/variables/variables.less",
			"./src/variables/mixins.less",
			"./src/dependencies/normalize.less",
			"./src/dependencies/print.less",
			"./src/dependencies/glyphicons.less",
			"./src/core/scaffolding.less",
			"./src/core/type.less",
			"./src/core/code.less",
			"./src/core/grid.less",
			"./src/core/tables.less",
			"./src/core/forms.less",
			"./src/core/buttons.less",
			"./src/components/component-animations.less",
			"./src/components/dropdowns/dropdowns.less",
			"./src/components/button-groups.less",
			"./src/components/input-groups.less",
			"./src/components/navs.less",
			"./src/components/navbar.less",
			"./src/components/breadcrumbs.less",
			"./src/components/pagination.less",
			"./src/components/pager.less",
			"./src/components/labels.less",
			"./src/components/badges.less",
			"./src/components/jumbotron.less",
			"./src/components/thumbnails.less",
			"./src/components/alerts.less",
			"./src/components/progress-bars.less",
			"./src/components/media.less",
			"./src/components/list-group.less",
			"./src/components/panels.less",
			"./src/components/responsive-embed.less",
			"./src/components/wells.less",
			"./src/components/close.less",
			"./src/components/modals.less",
			"./src/components/tooltip.less",
			"./src/components/popovers.less",
			"./src/components/carousel.less",
			"./src/utilities/utilities.less",
			"./src/utilities/responsive-utilities.less"
		],
		"distribution": "./dist/css/" 
	},
	"scripts": {
		"name": pkg.name + ".coffee",
		"source": ["./src/components/**/*.coffee", "!./src/components/**/*.spec.coffee"],
		"distribution": "./dist/js/"
	},
	"specs": {
		"name": pkg.name + ".spec.coffee",
		"source": ["./src/components/**/*.spec.coffee"],
		"distribution": "./dist/js/"
	},
	"fonts": {
		"source": "./src/fonts/*",
		"distribution": "./dist/fonts/"
	},
	"libs": {
		"name": pkg.name + ".libs.js",
		"source": [
			"./bower_components/angular/angular.min.js", 
			"./bower_components/angular-route/angular-route.min.js",
			"./bower_components/angular-resource/angular-resource.min.js",
			"./bower_components/angular-animate/angular-animate.min.js"],
		"distribution": "./dist/libs/"
	}
};

/**
 * Copy Fonts
 */
gulp.task('copy:fonts', function() {
   	gulp.src(path.fonts.source)
    	.pipe(gulp.dest(path.fonts.distribution));
});


/**
 * Copy Libs
 */
gulp.task('copy:libs', function() {
   	gulp.src(path.libs.source)
   		.pipe(concat(path.libs.name))
    	.pipe(gulp.dest(path.libs.distribution));
});


/**
 * Compile Styles
 */
gulp.task('compile:styles', function() {
   	gulp.src(path.styles.source)
    	.pipe(concat(path.styles.name))
    	.pipe(less({compress: true}).on('error', gutil.log))
      	.pipe(header(banner, {pkg: pkg}))
      	.pipe(gulp.dest(path.styles.distribution));
});


/**
 * Compile Scripts
 */
gulp.task('compile:scripts', function() {
   	gulp.src(path.scripts.source)
    	.pipe(concat(path.scripts.name))
    	.pipe(coffee().on('error', gutil.log))
    	.pipe(uglify())
      	.pipe(header(banner, {pkg: pkg}))
      	.pipe(gulp.dest(path.scripts.distribution));
});


/**
 * Compile Specs
 */
gulp.task('compile:specs', function() {
   	gulp.src(path.specs.source)
    	.pipe(concat(path.specs.name))
    	.pipe(coffee().on('error', gutil.log))
    	.pipe(uglify())
      	.pipe(header(banner, {pkg: pkg}))
      	.pipe(gulp.dest(path.specs.distribution));
});


/**
 * Run test once and exit
 *
 * gulp.task('test:script', function (done) {
 * 	karma.start({
 *   	configFile: __dirname + '/karma.conf.js',
 *   	singleRun: true
 * 	}, done);
 * });
 *
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  	karma.start({
    	configFile: __dirname + '/karma.conf.js'
  	}, done);
});

gulp.task('copy', ['copy:fonts', 'copy:libs']);

gulp.task('compile', function() {
  gulp.watch(path.scripts.source, ['compile:scripts']);
  gulp.watch(path.specs.source, ['compile:specs']);
});

gulp.task('init', ['compile:scripts', 'compile:specs']);

gulp.task('default', ['init', 'copy', 'compile', 'tdd']);