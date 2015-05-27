#!/usr/bin/env node

// backup posts to json
require('cache-require-paths');
var appRoot = require('app-root-path');
var _ = require('lodash');
var async = require('async');
var fs = require('graceful-fs');
var mkdirp = require('mkdirp');
var path = require('path');
var config = require('../config');
var utils = require('../lib/utils');

var savePath = appRoot + '/src/posts/proxy.js';
console.log(savePath);

async.map(process.argv.slice(2), utils.parsePosts, function (err, results) {
  var backupOut = {
    posts: results
  };
  fs.writeFile(savePath, JSON.stringify(backupOut, null, '  '), function (err, cb) {
    if (err) {
      cb(err);
    }
  });
});
