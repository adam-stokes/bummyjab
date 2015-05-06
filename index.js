var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var fm = require('fastmatter');
var async = require('async');
var handlebars = require('handlebars');
var moment = require('moment');
var metadata = require('./config')(process.argv);
var posts = require('./posts');

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

var items = posts.loadPosts();

async.parallel([
  function (callback) {
    console.log('Generating index');
    posts.genIndex(handlebars, items, function (err) {
      callback(err);
    });
  },
  function (callback) {
    console.log('Generating posts');
    posts.genPosts(handlebars, items, function (err) {
      callback(err);
    });
  }
], function (err, callback) {
  if (err) {
    console.error(err);
  }
});
