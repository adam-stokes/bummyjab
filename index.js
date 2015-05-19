var async = require('async');
var posts = require('./lib/posts');
var appRoot = require('app-root-path');

async.map(process.argv.slice(2), function (item, callback) {
  posts.loadPosts(item, function (err, res) {
    callback(null, res);
  });
}, function (err, items) {
  posts.genMaster(items, function (err) {
    callback(err);
  });
});
