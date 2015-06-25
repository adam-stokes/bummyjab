require 'cache-require-paths'
appRoot = require('app-root-path')
_ = require('lodash')
async = require('async')
fs = require('graceful-fs')
mkdirp = require('mkdirp')
path = require('path')
config = require('../config')
utils = require('../lib/utils')
savePath = appRoot + '/src/posts/proxy.js'
console.log savePath
async.map process.argv.slice(2), utils.parsePosts, (err, results) ->
  backupOut = posts: results
  fs.writeFile savePath, JSON.stringify(backupOut, null, '  '), (err, cb) ->
    if err
      cb err
    return
  return
