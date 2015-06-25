path = require('path')
# returns post string w/o date

exports.stringify = (post) ->
  bn = path.basename(post, '.md')
  stripDateRe = /^\d{4}-\d{2}-\d{2}-(.*)$/
  res = bn.match(stripDateRe)
  res[1]
