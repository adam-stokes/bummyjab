require('cache-require-paths');
var root = require('app-root-path');
var config = require('./config');
var site = require('./bummy');

var builder = Object.create(site);
builder.init(config, process.argv.slice(2));
builder.setup('build');
builder.build();
