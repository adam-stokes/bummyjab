require('cache-require-paths');
var root = require('app-root-path');
var config = require('./config');
var Bummyjab = require('./lib');

var builder = new Bummyjab(config, process.argv.slice(2));

console.log('building index');
builder.buildIndex();
builder.buildPosts();
