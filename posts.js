var _ = require('lodash');
var fs = require('fs');
var fm = require('fastmatter');
var markdown = require('marked');
var mkdirp = require('mkdirp');
var hljs = require('highlight.js');
var path = require('path');
var metadata = require('./config');
var utils = require('./utils');

markdown.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code)
      .value;
  }
});

var templates = {
  singlePage: fs.readFileSync(__dirname + '/templates/single.hbs')
    .toString(),
  indexPage: fs.readFileSync(__dirname + '/templates/home.hbs')
    .toString(),
  feedPage: fs.readFileSync(__dirname + '/templates/feed.hbs')
    .toString(),
  sitemapPage: fs.readFileSync(__dirname + '/templates/sitemap.hbs')
    .toString()
};

exports.loadPosts = function (post, callback) {
  var data = fs.readFileSync(post);
  var matter = fm(data.toString());
  matter.path = utils.stringify(post);
  matter.compiled = markdown(matter.body);
  callback(null, matter);
};

exports.genIndex = function (posts, callback) {
  var allPosts = _.sortByOrder(posts, ['attributes.date'], [false]);
  var html = utils.render({
    posts: allPosts,
    site: metadata
  }, templates.indexPage);
  var indexPath = path.join('build', 'index.html');
  fs.writeFile(indexPath, html, function (err) {
    if (err) {
      callback(err);
    }
  });
  callback(null);
};

exports.genFeed = function (posts, callback) {
  var allPosts = _.sortByOrder(posts, ['attributes.date'], [false]);
  var html = utils.render({
    posts: allPosts,
    site: metadata,
    feed: 'feed.xml'
  }, templates.feedPage);
  var feedPath = path.join('build', 'feed.xml');
  fs.writeFile(feedPath, html, function (err) {
    if (err) {
      callback(err);
    }
  });
  callback(null);
};

exports.genUbuntuFeed = function (posts, callback) {
  var allPosts = _.sortByOrder(posts, ['attributes.date'], [false]);
  var filtered = _.filter(allPosts, function (item) {
    return _.includes(item.attributes.tags, 'ubuntu');
  });
  var html = utils.render({
    posts: filtered,
    site: metadata,
    feed: 'ubuntu-feed.xml'
  }, templates.feedPage);
  var feedPath = path.join('build', 'ubuntu-feed.xml');
  fs.writeFile(feedPath, html, function (err) {
    if (err) {
      callback(err);
    }
  });
  callback(null);
};

exports.genSitemap = function (posts, callback) {
  var allPosts = _.sortByOrder(posts, ['attributes.date'], [false]);
  var html = utils.render({
    posts: allPosts,
    site: metadata,
    feed: 'sitemap.xml'
  }, templates.sitemapPage);
  var feedPath = path.join('build', 'sitemap.xml');
  fs.writeFile(feedPath, html, function (err) {
    if (err) {
      callback(err);
    }
  });
  callback(null);
};

exports.genPosts = function (posts, callback) {
  _.each(posts, function (post) {
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
  callback(null);
};
