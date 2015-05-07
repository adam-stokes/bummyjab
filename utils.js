var path = require('path');
var handlebars = require('handlebars');

exports.render = function(ctx, template) {
  var tpl = handlebars.compile(template);
  return tpl(ctx);
};

// returns post string w/o date
exports.stringify = function(post) {
  var bn = path.basename(post, '.md');
  var stripDateRe = /^\d{4}-\d{2}-\d{2}-(.*)$/;
  var res = bn.match(stripDateRe);
  return res[1];
};
