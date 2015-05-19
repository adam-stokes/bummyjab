#!/usr/bin/env node

var _ = require('lodash');
var fs = require('fs');
var fm = require('fastmatter');
var markdown = require('marked');
var mkdirp = require('mkdirp');
var hljs = require('highlight.js');
var path = require('path');
var metadata = require('../config');
var utils = require('../lib/utils');
var appRoot = require('app-root-path');
var moment = require('moment');
var handlebars = require('handlebars');
var posts = require('../lib/posts');

var templatePath = path.join(appRoot + '/templates');

var templates = {
  singlePage: fs.readFileSync(templatePath + '/single.hbs')
    .toString(),
  indexPage: fs.readFileSync(templatePath + '/home.hbs')
    .toString(),
  feedPage: fs.readFileSync(templatePath + '/feed.hbs')
    .toString(),
  sitemapPage: fs.readFileSync(templatePath + '/sitemap.hbs')
    .toString()
};

_.each(process.argv.slice(2), function (item) {
  posts.loadPosts(item, function(err, post) {
    var html = utils.render({
      attrs: post.attributes,
      body: post.compiled,
      site: metadata
    }, templates.singlePage);
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

  });
});
