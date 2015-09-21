'use strict';

var yaml = require('yamljs');
var config = yaml.load('config.yml');

module.exports = config;
