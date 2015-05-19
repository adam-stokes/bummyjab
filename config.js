var fs = require('fs');
var _ = require('lodash');
var appRoot = require('app-root-path');
var moment = require('moment');
var handlebars = require('handlebars');

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

module.exports = config = {
  'sitename': 'Adam Stokes',
  'title': 'steven seagal says hai.',
  'baseUrl': 'http://astokes.org',
  'description': 'ir0n fists'
};
