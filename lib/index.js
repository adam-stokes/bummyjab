var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var handlebars = require('handlebars');
var moment = require('moment');
var mkdirp = require('mkdirp');
var is = require('is');
var assert = require('assert');
var clone = require('clone');

module.exports = Bummyjab;

function Bummyjab() {
  if(!(this instanceof Bummyjab)) return new Bummyjab();
  this.metadata({});
  this.partials([]);
  this.source('src');
  this.destination('build');
}

/**
* Set partials
*/
Bummyjab.prototype.partials = function(partials) {
  if (!arguments.length) return this._partials;
  assert(is.array(partials), 'Must be an array of partials.');
  this._partials = clone(partials);
  return this;
};

/**
* Set/Get Global metadata
*/
Bummyjab.prototype.metadata = function(metadata) {
  if (!arguments.length) return this._metadata;
  assert(is.object(metadata), 'Pass metadata object.');
  this._metadata = clone(metadata);
  return this;
};

Bummyjab.prototype.source = function(path){
  if (!arguments.length) return this.path(this._source);
  assert(is.string(path), 'You must pass a source path string.');
  this._source = path;
  return this;
};

Bummyjab.prototype.destination = function(path){
  if (!arguments.length) return this.path(this._destination);
  assert(is.string(path), 'You must pass a destination path string.');
  this._destination = path;
  return this;
};

Bummyjab.prototype.build = function () {
  _.each(this.partials(), function (partial) {
    handlebars.registerPartial(partial, fs.readFileSync(__dirname + '/templates/partials/' + partial)
      .toString());
  });
};
