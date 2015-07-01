fs = require('graceful-fs')
fm = require('fastmatter')
moment = require('moment')
markdown = require('marked')
hljs = require('highlight.js')
utils = require('./utils')

# markdown.setOptions highlight: (code) ->
#   hljs.highlightAuto(code).value

class Post
  constructor: (post) ->
    @post = post
    body = fs.readFileSync @post, 'utf-8'
    @matter = fm(body.toString())
    @title = @matter.attributes.title ? "No title defined."
    @permalink = utils.stringify(@post)
    @date = moment(@matter.attributes.date).format('YYYY-MM-DDTHH:mm:ss')
    @tags = @matter.attributes.tags
    @author = @matter.attributes.author ? 'Adam Stokes'
    @html = markdown(@matter.body)
  hasCategory: (cat) ->
    if cat in @tags
      return true

module.exports = Post

