appRoot = require('app-root-path')
fs = require('fs')
path = require('path')
moment = require('moment')
handlebars = require('handlebars')

class Config
  constructor: ->
    @nodeEnv = process.env.NODE_ENV or 'development'
    @templateDir = "#{appRoot}/templates"
    @templates =
      singlePage: fs.readFileSync(appRoot + '/templates/single.hbs').toString()
      indexPage: fs.readFileSync(appRoot + '/templates/home.hbs').toString()
      feedPage: fs.readFileSync(appRoot + '/templates/feed.hbs').toString()
      sitemapPage: fs.readFileSync(appRoot + '/templates/sitemap.hbs').toString()
  opts: ->
    items =
      'development':
        'sitename': 'Adam Stokes'
        'title': 'steven seagal says hai.'
        'baseUrl': 'http://localhost:3000'
        'description': 'ir0n fists'
        templates: @templates
      'production':
        'sitename': 'Adam Stokes'
        'title': 'steven seagal says hai.'
        'baseUrl': 'http://astokes.org'
        'description': 'ir0n fists'
        templates: @templates
    items[@nodeEnv]

module.exports = Config
