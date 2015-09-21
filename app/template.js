'use strict';

var soynode = require('soynode');

function render(name, data) {
    var content;

    try {
        content = soynode.render(name, data);

        if (content.content) {
            content = content.content;
        }
    } catch (error) {
        console.trace(error);
        content = 'Internal Server Error.';
    } finally {
        return content;
    }
}

exports.render = render;
