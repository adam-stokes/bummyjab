var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var handlebars = require('handlebars');
var moment = require('moment');
var metadata = require('./config');
var posts = require('./posts');
var mkdirp = require('mkdirp');

var partials = ['header', 'footer', 'sidebar'];
_.each(partials, function (partial) {
  handlebars.registerPartial(partial, fs.readFileSync(__dirname + '/templates/partials/' + partial + '.hbs')
    .toString());
});

handlebars.registerHelper('date', function (date) {
  return moment(date)
    .format('Do MMMM YYYY');
});

handlebars.registerHelper('xmldate', function (date) {
  return moment(date)
    .format('ddd, DD MMM YYYY HH:mm:ss ZZ');
});

handlebars.registerHelper('sitemapdate', function (date) {
  return moment(date)
    .format('YYYY-MM-DD');
});

handlebars.registerHelper('link', function (path) {
  return metadata.baseUrl + '/' + path;
});

mkdirp('build', function (err) {
  if (err) {
    throw (err);
  }
});

async.map(process.argv.slice(2), function (item, callback) {
  posts.loadPosts(item, function (err, res) {
    callback(null, res);
  });
}, function (err, items) {
  async.parallel([
    function (callback) {
      posts.genIndex(items, function (err) {
        callback(err);
      });
    },
    function (callback) {
      posts.genFeed(items, function (err) {
        callback(err);
      });
    },
    function (callback) {
      posts.genUbuntuFeed(items, function (err) {
        callback(err);
      });
    },
    function (callback) {
      posts.genSitemap(items, function (err) {
        callback(err);
      });
    },
    function (callback) {
      posts.genPosts(items, function (err) {
        callback(err);
      });
    }
  ], function (err, result) {
    if (err) {
      console.error(err);
    }
  });
});
