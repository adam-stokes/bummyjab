#!/usr/bin/env node

var appRoot = require('app-root-path');
var _ = require('lodash');
var async = require('async');
var fs = require('graceful-fs');
var mkdirp = require('mkdirp');
var path = require('path');
var config = require('../config');
var utils = require('../lib/utils');

async.map(process.argv.slice(2), function (item, callback) {
  utils.parsePosts(item, function (err, post) {
    var html = utils.render({
      attrs: post.attributes,
      body: post.compiled,
      site: config
    }, config.templates.singlePage);
    var outputDir = path.join('build', post.path);
    mkdirp(outputDir, function (err) {
      if (err) {
        console.error('Error making dir: ' + err);
        callback(err);
      }
      fs.writeFile(path.join(outputDir, 'index.html'), html, function (err) {
        if (err) {
          callback(err);
        }
      });
    });
    callback(null);
  });
}, function (err, res) {
  if (err) {
    console.error(err);
  }
});
