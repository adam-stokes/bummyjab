var _ = require('lodash');
var fs = require('graceful-fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var utils = require('./utils');
var handlebars = require('handlebars');
var markdown = require('marked');
var fm = require('fastmatter');
var moment = require('moment');


var Bummyjab = {
    init: function(config, files) {
        this.files = files;
        this.config = config;
        this.parsed_files = [];
    },
    render: function(ctx, template) {
        var tpl = handlebars.compile(template);
        return tpl(ctx);
    },
    parsePosts: function(post, callback) {
        var _this = this;
        fs.readFile(post, function (err, data){
            if (err) throw err;
            var matter = fm(data.toString());
            matter.date = moment(matter.attributes.date)
                .format('YYYY-MM-DDTHH:mm:ss');
            matter.title = matter.attributes.title;
            matter.tags = matter.attributes.tags;
            matter.author = 'Adam Stokes';
            matter.path = utils.stringify(post);
            matter.compiled = markdown(matter.body);
            matter.site = _this.config;
            delete matter.attributes;
            _this.parsed_files.push(matter);
        });
    },
    setup: function(dest) {
        var _this = this;
        mkdirp(dest);
        _.forEach(_this.files, function (item) { _this.parsePosts(item); });
    },
    renderSingle: function(post) {
        var _this = this;
        var html = _this.render(post, _this.config.templates.singlePage);
        var outputDir = path.join('build', post.path);
        mkdirp(outputDir);
        fs.writeFile(path.join(outputDir, 'index.html'), html, function(err) {
            if (err) throw err;
        });
    },
    build: function() {
        var _this = this;
        console.log('Building site...');
        _.forEach(_this.parsed_files, function (item) {
            _this.renderSingle(item);
        });
        _this.renderFeeds();
        _this.renderFeed('ubuntu');
    },
    renderFeeds: function() {
        var _this = this;
        var allPosts = _.sortByOrder(_this.parsed_files, ['date'], [false]);
        var pageLists = [{
            feed:'feed.xml',
            tpl: _this.config.templates.feedPage
        }, {
            feed: 'sitemap.xml',
            tpl: _this.config.templates.sitemapPage
        }, {
            feed: 'index.html',
            tpl: _this.config.templates.indexPage
        }];
        _.forEach(pageLists, function (page) {
            var data = _this.render({
                posts: allPosts,
                site: _this.config
            }, page.tpl);
            fs.writeFile(path.join('build', page.feed), data, function (err) {
                if (err) throw (err);
            });
        });
    },
    renderFeed: function(category) {
        var _this = this;
        var allPosts = _.sortByOrder(_this.parsed_files, ['date'], [false]);
        var data = _this.render({
            posts: _.filter(allPosts, function (item) {
                return _.includes(item.tags, category);
            }),
            site: _this.config,
        }, _this.config.templates.feedPage);
        fs.writeFile(path.join('build', category+'-feed.xml'), data, function(err) {
            if (err) throw (err);
        });
    }
};

module.exports = Bummyjab;
