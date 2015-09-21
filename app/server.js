'use strict';

var url = require('url');
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

    soynode.compileTemplates(__dirname + '/views', function (err) {
        if (err) {
            throw err;
        }

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    handle403(req, res);
}

soynode.setOptions({
    inputDir: path.resolve(__dirname + '/../web/src'),
    outputDir: path.resolve(__dirname + '/../web/src'),
    allowDynamicRecompile: true,
    eraseTemporaryFiles: true
});

server = app.listen(config.server.port, config.server.address, function () {
    console.log('Connect to ' + config.server.address + ':' + config.server.port);
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
    var body = '';

    request.setEncoding('utf8');

    request.on('data', function (chuck) {
        body += chuck;
    });

    request.on('end', function () {
        middleware.search('law', 'projects', url.parse(request.url, true).query)
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
});

app.use(express.static(__dirname + '/../web/build'));
app.use(express.static(__dirname + '/../web/static', {
    extensions: 'html'
}));

app.use(handle404);