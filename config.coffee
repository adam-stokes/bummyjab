appRoot = require('app-root-path')
fs = require('fs')
path = require('path')
_ = require('lodash')
moment = require('moment')
handlebars = require('handlebars')
markdown = require('marked')
hljs = require('highlight.js')
markdown.setOptions highlight: (code) ->
  hljs.highlightAuto(code).value
partials = [
  'header'
  'footer'
  'sidebar'
]
_.forEach partials, (partial) ->
  handlebars.registerPartial partial, fs.readFileSync(appRoot + '/templates/partials/' + partial + '.hbs').toString()
  return
templates = 
  singlePage: fs.readFileSync(appRoot + '/templates/single.hbs').toString()
  indexPage: fs.readFileSync(appRoot + '/templates/home.hbs').toString()
  feedPage: fs.readFileSync(appRoot + '/templates/feed.hbs').toString()
  sitemapPage: fs.readFileSync(appRoot + '/templates/sitemap.hbs').toString()
node_env = process.env.NODE_ENV or 'development'
config = 
  'development':
    'sitename': 'Adam Stokes'
    'title': 'steven seagal says hai.'
    'baseUrl': 'http://localhost:3000'
    'description': 'ir0n fists'
    templates: templates
  'production':
    'sitename': 'Adam Stokes'
    'title': 'steven seagal says hai.'
    'baseUrl': 'http://astokes.org'
    'description': 'ir0n fists'
    templates: templates
handlebars.registerHelper 'date', (date) ->
  moment(date).format 'Do MMMM YYYY'
handlebars.registerHelper 'xmldate', (date) ->
  moment(date).format 'ddd, DD MMM YYYY HH:mm:ss ZZ'
handlebars.registerHelper 'sitemapdate', (date) ->
  moment(date).format 'YYYY-MM-DD'
handlebars.registerHelper 'link', (path) ->
  config[node_env].baseUrl + '/' + path
module.exports = config[node_env]
