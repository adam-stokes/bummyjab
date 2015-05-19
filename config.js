var appRoot = require('app-root-path');

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var moment = require('moment');
var handlebars = require('handlebars');
var markdown = require('marked');
var hljs = require('highlight.js');

markdown.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code)
      .value;
  }
});

var partials = ['header', 'footer', 'sidebar'];
_.each(partials, function (partial) {
  handlebars.registerPartial(partial, fs.readFileSync(appRoot + '/templates/partials/' + partial + '.hbs')
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
  return config.baseUrl + '/' + path;
});


var templates = {
  singlePage: fs.readFileSync(appRoot + '/templates/single.hbs')
    .toString(),
  indexPage: fs.readFileSync(appRoot + '/templates/home.hbs')
    .toString(),
  feedPage: fs.readFileSync(appRoot + '/templates/feed.hbs')
    .toString(),
  sitemapPage: fs.readFileSync(appRoot + '/templates/sitemap.hbs')
    .toString()
};

module.exports = config = {
  'sitename': 'Adam Stokes',
  'title': 'steven seagal says hai.',
  'baseUrl': 'http://astokes.org',
  'description': 'ir0n fists',
  templates: templates
};
