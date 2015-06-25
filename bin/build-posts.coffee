require 'cache-require-paths'
appRoot = require('app-root-path')
_ = require('lodash')
async = require('async')
fs = require('graceful-fs')
mkdirp = require('mkdirp')
path = require('path')
config = require('../config')
utils = require('../lib/utils')
async.map process.argv.slice(2), ((item, callback) ->
  utils.parsePosts item, (err, post) ->
    html = utils.render({
      title: post.title
      date: post.date
      author: post.author
      body: post.compiled
      tags: post.tags
      site: config
    }, config.templates.singlePage)
    outputDir = path.join('build', post.path)
    mkdirp outputDir, (err) ->
      if err
        console.error 'Error making dir: ' + err
        callback err
      fs.writeFile path.join(outputDir, 'index.html'), html, (err) ->
        if err
          callback err
        return
      return
    callback null
    return
  return
), (err, res) ->
  if err
    console.error err
  return
