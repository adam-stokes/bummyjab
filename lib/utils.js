var fm = require('fastmatter');
var fs = require('fs');
var path = require('path');
var markdown = require('marked');
var handlebars = require('handlebars');

exports.render = function (ctx, template) {
  var tpl = handlebars.compile(template);
  return tpl(ctx);
};

// returns post string w/o date
function stringify(post) {
  var bn = path.basename(post, '.md');
  var stripDateRe = /^\d{4}-\d{2}-\d{2}-(.*)$/;
  var res = bn.match(stripDateRe);
  return res[1];
};

exports.parsePosts = function (post, callback) {
  fs.readFile(post, function (err, data) {
    var matter = fm(data.toString());
    matter.path = stringify(post);
    matter.compiled = markdown(matter.body);
    callback(null, matter);
  });
};
