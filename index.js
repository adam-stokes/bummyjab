var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var fm = require('fastmatter');
var async = require('async');
var handlebars = require('handlebars');
var markdown = require('marked');
var hljs = require('highlight.js');
var moment = require('moment');
var wagner = require('wagner-core');
var metadata = require('./config')(process.argv);
var posts = require('./posts');

markdown.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code)
      .value;
  }
});

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

async.waterfall([
    function (callback) {
      console.log('Generating posts.');
      posts.loadPosts(function (err, post, matter) {
        callback(null, post, matter);
      });
    },
    function (post, matter, callback) {
      var template = handlebars.compile(posts.templates.singlePage);
      var post_ctx = {
        attrs: matter.attributes,
        body: markdown(matter.body)
      };
      var html = template(post_ctx);
      callback(null, post, html);
    },
    function (post, html, callback) {
      var bn = path.basename(post, '.md');
      fs.writeFile('/tmp/' + bn + '.html', html, function (err) {
        if (err) {
          callback(err);
        }
        callback(null);
      });
    }
  ],
  function (err, results) {
    if (err) {
      console.log('Error: ' + err);
    }
  });
