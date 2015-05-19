var _ = require('lodash');
var fs = require('fs');
var fm = require('fastmatter');
var markdown = require('marked');
var mkdirp = require('mkdirp');
var hljs = require('highlight.js');
var path = require('path');
var metadata = require('../config');
var utils = require('./utils');
var appRoot = require('app-root-path');
var moment = require('moment');
var handlebars = require('handlebars');

markdown.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code)
      .value;
  }
});

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

exports.loadPosts = function (post, callback) {
  fs.readFile(post, function (err, data) {
    var matter = fm(data.toString());
    matter.path = utils.stringify(post);
    matter.compiled = markdown(matter.body);
    callback(null, matter);
  });
};

exports.genMaster = function (posts, callback) {
  var mapPosts = {
    allPosts: _.sortByOrder(posts, ['attributes.date'], [false]),
    filtered: _.filter(this.allPosts, function (item) {
      return _.includes(item.attributes.tags, 'ubuntu');
    })
  };

  // TODO: optimize
  var postData = [{
    html: utils.render({
      posts: mapPosts.allPosts,
      site: metadata
    }, templates.indexPage),
    page: 'index.html'
  }, {
    html: utils.render({
      posts: mapPosts.allPosts,
      site: metadata,
      feed: 'feed.xml'
    }, templates.feedPage),
    page: 'feed.xml'
  }, {
    html: utils.render({
      posts: mapPosts.filtered,
      site: metadata,
      feed: 'ubuntu-feed.xml'
    }, templates.feedPage),
    page: 'ubuntu-feed.xml'
  }, {
    html: utils.render({
      posts: mapPosts.allPosts,
      site: metadata,
      feed: 'sitemap.xml'
    }, templates.sitemapPage),
    page: 'sitemap.xml'
  }];
  _.each(postData, function (item, callback) {
    fs.writeFile(path.join('build', item.page), item.html, function (err) {
      if (err) {
        callback(err);
      }
    });
  });
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
