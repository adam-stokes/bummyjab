var _ = require('lodash');
var fs = require('fs');
var fm = require('fastmatter');
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

wagner.task('generatePosts', function (callback) {
  console.log('Generating posts');
  wagner.parallel(
    posts.allPosts,
    function (post, callback) {
      console.log('Generating "' + post.attributes.title + "'");
    },
    callback
  );
});

wagner.invokeAsync(function (error, generatePosts) {
  if (error) {
    return console.log('Errors: ' + error + '\n' + error.stack);
  }
  console.log('Done');
});
