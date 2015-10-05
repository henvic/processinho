'use strict';

var url = require('url');
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var soynode = require('soynode');
var bodyParser = require('body-parser');
var csrf = require('csurf');
var passport = require('passport');
var app = express();
var PersonaStrategy = require('passport-persona').Strategy;
var config = require('./config');
var middleware = require('./search/middleware');
var template = require('./template');
var marked = require('marked');
var csrfProtection = csrf({ cookie: true });
var server;

function errorHandler(req, res, error) {
    res.status(error);

    if (req.accepts('html')) {
        res.send(template.render('app.error' + error, {
            verb: req.method,
            url: req.url
        }));
        return;
    }

    if (req.accepts('json')) {
        res.send({
            error: error
        });
        return;
    }

    res.type('txt').send(error);
}

function handle403(req, res) {
    return errorHandler(req, res, 403);
}

function handle404(req, res) {
    return errorHandler(req, res, 404);
}

function handle500(req, res) {
    return errorHandler(req, res, 500);
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    handle403(req, res);
}

if (config.reverse_proxy) {
    app.set('trust proxy', config.reverse_proxy);
}

soynode.setOptions({
    // __dirname + '/../web/src'
    inputDir: path.resolve('/Users/henvic/projects/processinho/web/src'),
    outputDir: path.resolve('/Users/henvic/projects/processinho/web/src/foo'),
    allowDynamicRecompile: true,
    eraseTemporaryFiles: true
});

server = app.listen(config.server.port, config.server.address, function () {
    console.log('Connect to http://' + config.server.address + ':' + config.server.port + '/');
    app.use(cookieParser());
    app.use(session({keys: ['not-really-secret-app-key']}));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
});

process.on('SIGTERM', function () {
    server.close(function () {
        console.log('Closing server gracefully.');
        process.exit(0);
    });
});

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.email);
});

passport.deserializeUser(function (email, done) {
    done(null, { email: email });
});

passport.use(new PersonaStrategy({
    audience: config.persona.audience
},
function (email, done) {
    process.nextTick(function () {
      // In a typical application, you would want
      // to associate the email address with a user record in your database, and
      // return that user instead.
      return done(null, {
        email: email
    });
  });
}));

app.post('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/auth',
    passport.authenticate('persona', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/');
    }
);

app.get('/search', function (request, response) {
    middleware.search('legisapp', 'documento', url.parse(request.url, true).query)
    .then(function (results) {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end(JSON.stringify(results));
    })
    .catch(function (e) {
        console.error(e);
        handle403(request, response);
    });
});

app.get('/docs/:id', function (request, response, next) {
    var id;
    var body;
    var content;

    if (typeof request.params.id !== 'string') {
        next();
        return;
    }

    id = request.params.id;

    middleware.get('legisapp', 'documento', id)
    .then(function (results) {
        response.header("Content-Type", "text/html; charset=utf-8");

        content = marked(results._source.texto_puro, {
            sanitize: true,
            smartypants: true,
            breaks: true
        });

        body = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">' +
        '<title>LegisApp</title>' +
        '<meta name="viewport" content="width=device-width">' +
        '<link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.css">' +
        '<link rel="stylesheet" href="../processinho.css">' +
        '<base href="/" /></head><body><div class="row"><div class="large-12 columns">' + content +
        '</div></div></body></html>';

        response.end(body);
    })
    .catch(function (e) {
        console.error(e);
        handle403(request, response);
    });
});

app.use('/bower_components', express.static(__dirname + '/../web/bower_components'));
app.use(express.static(__dirname + '/../web/build'));
app.use(express.static(__dirname + '/../web/static', {
    extensions: 'html'
}));

app.use(handle404);
