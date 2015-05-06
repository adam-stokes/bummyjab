var outDir = './build';

var prod = {
    'sitename': 'Adam Stokes',
    'baseUrl': 'http://astokes.org',
    'description': 'ir0n fists',
    'isDev': false,
    'output': outDir
  },
  dev = {
    'sitename': 'Adam Stokes (DEV)',
    'baseUrl': 'http://localhost:3000',
    'description': 'ir0n fists',
    'isDev': true,
    'output': outDir
  };

module.exports = function (args) {
  'use strict';
  var config = dev;

  args.forEach(function (val) {
    if (val === '--prod' || val === '-p') {
      config = prod;
    }
  });

  return config;

};
