var _ = require('lodash');
var fs = require('fs');
var fm = require('fastmatter');
var markdown = require('marked');
var hljs = require('highlight.js');
var path = require('path');
var mkdirp = require('mkdirp');

markdown.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code)
      .value;
  }
});

var templates = {
  singlePage: fs.readFileSync(__dirname + '/templates/single.hbs')
    .toString(),
  indexPage: fs.readFileSync(__dirname + '/templates/home.hbs')
    .toString()
};

// returns post string w/o date
function stringify(post) {
  var bn = path.basename(post, '.md');
  var stripDateRe = /^\d{4}-\d{2}-\d{2}-(.*)$/;
  var res = bn.match(stripDateRe);
  return res[1];
}

function parseFM(post) {
  var item = fs.readFileSync('src/posts/' + post);
  var matter = fm(item.toString());
  matter.path = stringify(post);
  matter.compiled = markdown(matter.body);
  return matter;
}

exports.loadPosts = function () {
  var compiledPosts = [];
  var posts = fs.readdirSync('src/posts');
    _.each(posts, function (post) {
      var matter = parseFM(post);
      compiledPosts.push(matter);
    });
  return compiledPosts;
};

exports.genIndex = function (handlebars, posts, callback) {
  var allPosts = _.sortByOrder(posts, ['attributes.date'], [false]);
  var postList = {
    posts: allPosts
  };
  var template = handlebars.compile(templates.indexPage);
  var html = template(postList);
  mkdirp('build', function (err) {
    if (err) {
      callback(err);
    }
    fs.writeFile(path.join('build', 'index.html'), html, function (err) {
      if (err) {
        callback(err);
      }
    });
  });
  callback(null);
};

exports.genPosts = function (handlebars, posts, callback) {
  _.each(posts, function (post) {
    var template = handlebars.compile(templates.singlePage);
    var post_ctx = {
      attrs: post.attributes,
      body: post.compiled
    };
    var html = template(post_ctx);
    var outputDir = path.join('build', post.path);
    mkdirp(outputDir, function (err) {
      if (err) {
        console.error('Error making dir: ' + err);
        callback(err);
      }
      fs.writeFile(path.join(outputDir, 'index.html'), html, function (err) {
        if (err) {
          callback(err);
        }
      });
    });
  });
  callback(null);
};
