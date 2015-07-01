Promise = require('bluebird')
Config = require('./config')
Site = Promise.promisifyAll(require('./bummy'))
Handlebars = require('handlebars')
Path = require('path')
Fs = require('graceful-fs')
moment = require('moment')

# Setup partials
partials = ['header', 'footer', 'sidebar']

cfg = new Config()

for partial in partials
  Handlebars.registerPartial partial, Fs.readFileSync(Path.join(cfg.templateDir, "partials/#{partial}.hbs")).toString()

Handlebars.registerHelper 'date', (date) ->
  moment(date).format 'Do MMMM YYYY'

Handlebars.registerHelper 'xmldate', (date) ->
  moment(date).format 'ddd, DD MMM YYYY HH:mm:ss ZZ'

Handlebars.registerHelper 'sitemapdate', (date) ->
  moment(date).format 'YYYY-MM-DD'

Handlebars.registerHelper 'link', (path) ->
  "#{cfg.opts().baseUrl}/#{path}"

Handlebars.registerHelper 'sitename', ->
  "#{cfg.opts().sitename}"

Handlebars.registerHelper 'siteDescription', ->
  "#{cfg.opts().description}"

Handlebars.registerHelper 'siteTitle', ->
  "#{cfg.opts().title}"

build = new Site(cfg, process.argv.slice(2), 'build')
build.generate()
  .then(-> return build.feeds())
  .then(-> return build.singles())
  .catch((e) -> throw new Error(e))
