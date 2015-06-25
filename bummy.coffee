_ = require('lodash')
fs = require('graceful-fs')
path = require('path')
async = require('async')
mkdirp = require('mkdirp')
utils = require('./utils')
handlebars = require('handlebars')
markdown = require('marked')
fm = require('fastmatter')
moment = require('moment')
Bummyjab =
  init: (config, files) ->
    @files = files
    @config = config
    @parsed_files = []
    return
  render: (ctx, template) ->
    tpl = handlebars.compile(template)
    tpl ctx
  parsePosts: (post, callback) ->
    self = this
    fs.readFile post, (err, data) ->
      if err
        throw err
      matter = fm(data.toString())
      matter.date = moment(matter.attributes.date).format('YYYY-MM-DDTHH:mm:ss')
      matter.title = matter.attributes.title
      matter.tags = matter.attributes.tags
      matter.author = 'Adam Stokes'
      matter.path = utils.stringify(post)
      matter.compiled = markdown(matter.body)
      matter.site = self.config
      delete matter.attributes
      self.parsed_files.push matter
      return
    return
  setup: (dest) ->
    self = this
    mkdirp dest
    _.forEach self.files, (item) ->
      self.parsePosts item
      return
    return
  renderSingle: (post) ->
    self = this
    html = self.render(post, self.config.templates.singlePage)
    outputDir = path.join('build', post.path)
    mkdirp outputDir
    fs.writeFile path.join(outputDir, 'index.html'), html, (err) ->
      if err
        throw err
      return
    return
  build: ->
    self = this
    console.log 'Building site...'
    _.forEach self.parsed_files, (item) ->
      self.renderSingle item
      return
    self.renderFeeds()
    self.renderFeed 'ubuntu'
    return
  renderFeeds: ->
    self = this
    allPosts = _.sortByOrder(self.parsed_files, [ 'date' ], [ false ])
    pageLists = [
      {
        feed: 'feed.xml'
        tpl: self.config.templates.feedPage
      }
      {
        feed: 'sitemap.xml'
        tpl: self.config.templates.sitemapPage
      }
      {
        feed: 'index.html'
        tpl: self.config.templates.indexPage
      }
    ]
    _.forEach pageLists, (page) ->
      data = self.render({
        posts: allPosts
        site: self.config
      }, page.tpl)
      fs.writeFile path.join('build', page.feed), data, (err) ->
        if err
          throw err
        return
      return
    return
  renderFeed: (category) ->
    self = this
    allPosts = _.sortByOrder(self.parsed_files, [ 'date' ], [ false ])
    data = self.render({
      posts: _.filter(allPosts, (item) ->
        _.includes item.tags, category
      )
      site: self.config
    }, self.config.templates.feedPage)
    fs.writeFile path.join('build', category + '-feed.xml'), data, (err) ->
      if err
        throw err
      return
    return
module.exports = Bummyjab
