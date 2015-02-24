'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var mocha = require('gulp-spawn-mocha');

var paths = {
  lint: ['./gulpfile.js', './src/**/*.js'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}'],
  source: ['./lib/*.js']
};

var plumberConf = {};

if (process.env.CI) {
  plumberConf.errorHandler = function(err) {
    throw err;
  };
}

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.plumber(plumberConf));
});

gulp.task('istanbul', function (cb) {
  gulp.src([ 'lib/**/*.js' ])
    .on('finish', function () {
      gulp.src([ 'test/**/*.js' ])
        .pipe(mocha({
          istanbul: true
        }))
        .on('end', function (err) {
          cb(err);
        });
    });
});

gulp.task('bump', ['test'], function () {
  var bumpType = plugins.util.env.type || 'patch'; // major.minor.patch

  return gulp.src(['./package.json'])
    .pipe(plugins.bump({ type: bumpType }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', ['test'], function () {
  gulp.watch(paths.watch, ['test']);
});

gulp.task('test', ['lint', 'istanbul']);

gulp.task('release', ['bump']);

gulp.task('default', ['test']);
