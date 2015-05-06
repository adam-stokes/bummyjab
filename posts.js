var _ = require('lodash');
var fs = require('fs');
var fm = require('fastmatter');

function parseFM(post) {
  fs.readFile('src/posts/' + post, function (error, item) {
    var matter = fm(item.toString());
    console.log('frontmatter: ' + matter.attributes.title);
    return matter;
  });
}

function loadPosts() {
  fs.readdir('src/posts', function (err, posts) {
    _.each(posts, function (post) {
      parseFM(post);
    });
  });
}

exports.allPosts = loadPosts;
