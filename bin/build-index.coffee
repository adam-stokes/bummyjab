require 'cache-require-paths'
_ = require('lodash')
fs = require('graceful-fs')
path = require('path')
async = require('async')
config = require('../config')
utils = require('../lib/utils')
async.map process.argv.slice(2), ((item, callback) ->
  utils.parsePosts item, (err, res) ->
    callback null, res
    return
  return
), (err, posts) ->
  allPosts = _.sortByOrder(posts, [ 'date' ], [ false ])
  postData = [
    {
      html: utils.render({
        posts: allPosts
        site: config
      }, config.templates.indexPage)
      page: 'index.html'
    }
    {
      html: utils.render({
        posts: allPosts
        site: config
        feed: 'feed.xml'
      }, config.templates.feedPage)
      page: 'feed.xml'
    }
    {
      html: utils.render({
        posts: _.filter(allPosts, (item) ->
          _.includes item.tags, 'ubuntu'
        )
        site: config
        feed: 'ubuntu-feed.xml'
      }, config.templates.feedPage)
      page: 'ubuntu-feed.xml'
    }
    {
      html: utils.render({
        posts: allPosts
        site: config
        feed: 'sitemap.xml'
      }, config.templates.sitemapPage)
      page: 'sitemap.xml'
    }
  ]
  _.each postData, (item, callback) ->
    fs.writeFile path.join('build', item.page), item.html, (err) ->
      if err
        callback err
      return
    return
  return
