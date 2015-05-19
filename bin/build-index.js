#!/usr/bin/env node

var _ = require('lodash');
var fs = require('graceful-fs');
var path = require('path');
var async = require('async');
var config = require('../config');
var utils = require('../lib/utils');

async.map(process.argv.slice(2), function (item, callback) {
  utils.parsePosts(item, function (err, res) {
    callback(null, res);
  });
}, function (err, posts) {
  var allPosts= _.sortByOrder(posts, ['date'], [false]);
  var postData = [{
    html: utils.render({
      posts: allPosts,
      site: config
    }, config.templates.indexPage),
    page: 'index.html'
  }, {
    html: utils.render({
      posts: allPosts,
      site: config,
      feed: 'feed.xml'
    }, config.templates.feedPage),
    page: 'feed.xml'
  }, {
    html: utils.render({
      posts: _.filter(allPosts, function (item) {
        return _.includes(item.tags, 'ubuntu');
      }),
      site: config,
      feed: 'ubuntu-feed.xml'
    }, config.templates.feedPage),
    page: 'ubuntu-feed.xml'
  }, {
    html: utils.render({
      posts: allPosts,
      site: config,
      feed: 'sitemap.xml'
    }, config.templates.sitemapPage),
    page: 'sitemap.xml'
  }];
  _.each(postData, function (item, callback) {
    fs.writeFile(path.join('build', item.page), item.html, function (err) {
      if (err) {
        callback(err);
      }
    });
  });
});
