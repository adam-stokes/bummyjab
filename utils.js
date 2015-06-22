var path = require('path');

// returns post string w/o date
exports.stringify = function (post) {
  var bn = path.basename(post, '.md');
  var stripDateRe = /^\d{4}-\d{2}-\d{2}-(.*)$/;
  var res = bn.match(stripDateRe);
  return res[1];
}
