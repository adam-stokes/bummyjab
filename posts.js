var _ = require('lodash');
var fs = require('fs');
var fm = require('fastmatter');

function parseFM(post) {
  var item = fs.readFileSync('src/posts/' + post);
  var matter = fm(item.toString());
  return matter;
}

exports.templates = {
  singlePage: fs.readFileSync(__dirname + '/templates/single.hbs')
    .toString(),
  indexPage: fs.readFileSync(__dirname + '/templates/home.hbs')
    .toString()
};

exports.loadPosts = function (callback) {
  fs.readdir('src/posts', function (err, posts) {
    _.each(posts, function (post) {
      var matter = parseFM(post);
      callback(null, post, matter);
    });
  });
};
