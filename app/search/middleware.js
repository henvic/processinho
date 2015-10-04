'use strict';

var http = require('http');
var config = require('../config');

function search(index, type, query) {
    var options;
    var buffer = '';
    var body;
    var reqBuffer;
    var from;
    var size;
    var q;
    var qSuggestion;

    body = {
        'query': {
            'filtered': {
                query: {}
            }
        },
        'highlight': {
            'fields': {
                'texto_puro': {}
            },
            'encoder': 'html'
        }
    };

    q = '';
    qSuggestion = '';

    if (query.q !== undefined && typeof query.q === 'string' && query.q !== '') {
        if (query.suggestion !== undefined) {
            q = '*';
            qSuggestion = query.q;
        } else {
            q = query.q;
            qSuggestion = q;
        }
    } else {
        q = '*';
        qSuggestion = '*';
    }

    body.query.filtered.query.query_string = {
        'query': q,
        'default_operator': 'AND'
    };

    from = 0;
    size = 10;

    if (query.facets !== undefined || query.suggestion !== undefined) {
        size = 0;
    } else if (query.size !== undefined && !isNaN(query.size)) {
        size = parseInt(query.size, 10);
    }

    if (query.from !== undefined && !isNaN(query.from)) {
        from = parseInt(query.from, 10) - 1;
    }

    reqBuffer = JSON.stringify(body);

    options = {
        hostname: config.elastic.hostname,
        path: '/' + index + '/' + type + '/_search?size=' + encodeURIComponent(size) + '&from=' + encodeURIComponent(from),
        port: config.elastic.port,
        method: 'GET',
        headers: {
            'Content-Length': Buffer.byteLength(reqBuffer)
        }
    };

    return new Promise(function queryBackend(resolve, reject) {
        var req = http.request(options, function (res) {
            res.setEncoding('utf8');

            res.on('data', function (data) {
                buffer += data;
            });

            res.on('end', function () {
                var responseBody = JSON.parse(buffer);

                if (res.statusCode === 200) {
                    resolve(responseBody);
                    return;
                }

                reject(responseBody, res);
            });
        });

        req.on('error', function (e) {
            throw e;
        });

        req.write(JSON.stringify(body));
        req.end();
    });
}

function get(index, type, id) {
    var options;
    var buffer = '';

    options = {
        hostname: config.elastic.hostname,
        path: '/' + index + '/' + type + '/' + id,
        port: config.elastic.port,
        method: 'GET'
    };

    return new Promise(function queryBackend(resolve, reject) {
        var req = http.request(options, function (res) {
            res.setEncoding('utf8');

            res.on('data', function (data) {
                buffer += data;
            });

            res.on('end', function () {
                var responseBody = JSON.parse(buffer);

                if (res.statusCode === 200) {
                    resolve(responseBody);
                    return;
                }

                reject(responseBody, res);
            });
        });

        req.on('error', function (e) {
            throw e;
        });

        req.end();
    });
}

module.exports.search = search;
module.exports.get = get;
