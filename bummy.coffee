Promise = require('bluebird')

mkdirp = Promise.promisify(require('mkdirp'))
rm = Promise.promisify(require('rimraf'))
fs = Promise.promisifyAll(require('graceful-fs'))

_ = require('lodash')
path = require('path')
handlebars = require('handlebars')

# Internal
Post = require('./post')

Array::empty = ->
  @.length == 0

class Bummyjab
  constructor: (@config, @files) ->

  render: (post, template) ->
    tpl = handlebars.compile(template)
    tpl post

  queue: ->
    parsed_files = []
    for item in @files
      tmpPost = new Post(item)
      parsed_files.push tmpPost
    return parsed_files

  generate: ->
    console.log "Generating site for #{@config.opts().sitename}"
    rm('build')
    .then(-> return mkdirp('build'))
    .catch((e) -> throw new Error(e))

  feeds: ->
    console.log "Rendering feeds ..."
    allPosts = _.sortByOrder(@queue(), [ 'date' ], [ false ])
    categorized_feed = []
    index_feed = []
    for post in allPosts
      if post.hasCategory('ubuntu')
        categorized_feed.push post
      index_feed.push post

    if not categorized_feed.empty()
      console.log "Writing Ubuntu feed"
      fs.writeFileSync(path.join('build', 'ubuntu-feed.xml'), @render(categorized_feed, @config.templates.feedPage))

    if not index_feed.empty()
      console.log "Writing index and sitemap feeds"
      fs.writeFileSync(path.join('build', 'feed.xml'), @render(index_feed, @config.templates.feedPage))
      fs.writeFileSync(path.join('build', 'sitemap.xml'), @render(index_feed, @config.templates.sitemapPage))
      fs.writeFileSync(path.join('build', 'index.html'), @render(index_feed, @config.templates.indexPage))

  singles: ->
    allPosts = _.sortByOrder(@queue(), [ 'date' ], [ false ])
    for post in allPosts
      html = @render(post, @config.templates.singlePage)
      outputDir = path.join('build', post.permalink)
      @writePost(html, outputDir)

  writePost: (html, outputDir) ->
    savePath = path.join(outputDir, 'index.html')
    mkdirp outputDir, (err) ->
      if err
        throw err
      else
        console.log "Writing #{savePath}"
        fs.writeFileSync(savePath, html)

module.exports = Bummyjab
