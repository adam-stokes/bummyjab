var appRoot = require('app-root-path');
var _ = require('lodash');
var fs = require('graceful-fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var utils = require('./utils');


module.exports = Bummyjab;

function Bummyjab(config, files) {
    this.files = files;
    this.config = config;
}

Bummyjab.prototype.buildPosts = function() {
    var _this = this;
    async.map(_this.files, function (item, callback) {
        utils.parsePosts(item, function (err, post) {
            var html = utils.render({
                title: post.title,
                date: post.date,
                author: post.author,
                body: post.compiled,
                tags: post.tags,
                site: _this.config
            }, _this.config.templates.singlePage);
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
            callback(null);
        });
    }, function (err, res) {
        if (err) {
            console.error(err);
        }
    });

}

Bummyjab.prototype.buildIndex = function() {
    var _this = this;
    async.map(_this.files, function (item, callback) {
        utils.parsePosts(item, function (err, res) {
            callback(null, res);
        });
    }, function (err, posts) {
        var allPosts = _.sortByOrder(posts, ['date'], [false]);
        var postData = [{
            html: utils.render({
                posts: allPosts,
                site: _this.config
            }, _this.config.templates.indexPage),
            page: 'index.html'
        }, {
            html: utils.render({
                posts: allPosts,
                site: _this.config,
                feed: 'feed.xml'
            }, _this.config.templates.feedPage),
            page: 'feed.xml'
        }, {
            html: utils.render({
                posts: _.filter(allPosts, function (item) {
                    return _.includes(item.tags, 'ubuntu');
                }),
                site: _this.config,
                feed: 'ubuntu-feed.xml'
            }, _this.config.templates.feedPage),
            page: 'ubuntu-feed.xml'
        }, {
            html: utils.render({
                posts: allPosts,
                site: _this.config,
                feed: 'sitemap.xml'
            }, _this.config.templates.sitemapPage),
            page: 'sitemap.xml'
        }];
        _.forEach(postData, function (item) {
            fs.writeFile(path.join('build', item.page), item.html, function (err) {
                if (err) {
                    throw (err);
                }
            });
        });
    });
}
