'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jsBlackList = [
    'app/**/*.js',
    'tasks/**/*.js',
    'web/**/*.js',
    '*.js',
    '!web/bower_components/**/*.js',
    '!web/build/**/*.js',
    '!web/src/**/*.soy.js'
];

function lintTask() {
    return gulp.src(jsBlackList)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .pipe(jscs());
}

gulp.task('lint', lintTask);
