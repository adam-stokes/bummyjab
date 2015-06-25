require 'cache-require-paths'
root = require('app-root-path')
config = require('./config')
site = require('./bummy')
builder = Object.create(site)
builder.init config, process.argv.slice(2)
builder.setup 'build'
builder.build()
