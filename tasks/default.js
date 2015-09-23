'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var header;
var content;
var footer;

header = '\nprocessinho task-runner tool CLI.\n\n' +
    gutil.colors.underline('Usage') + '\n  gulp <command>\n\n' +
    'The most commonly used task are:';

content = {
    'lint': 'Lint JavaScript code',
    'test': 'Run unit tests',
    'report': 'Open code coverage report',
    'metal:test': 'Run browser tests',
    'metal:test:coverage': 'Run browser tests and open code coverage',
    'metal:test:browsers': 'Run browser tests on several browsers',
    'metal:test:watch': 'Run tests on source changes'
};

function help(callback) {
    var output = '';
    var spacing = 0;
    var methods;

    methods = Object.keys(content).sort(function (a, b) {
        return a.localeCompare(b);
    });

    methods.forEach(function (item) {
        if (spacing < item.length) {
            spacing = item.length + 3;
        }
    });

    methods.forEach(function (item) {
        output += '  ' + gutil.colors.cyan(item) +
            new Array(spacing - item.length + 1).join(' ') +
            content[item] + '\n';
    });

    if (header) {
        output = header + '\n' + output;
    }

    if (footer) {
        output += '\n' + footer;
    }

    console.log(output);
    callback();
}

gulp.task('default', help);
gulp.task('help', help);
