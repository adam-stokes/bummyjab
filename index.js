var Bummyjab = require('./lib');
var config = require('./config');

var bj = Bummyjab();

// define partials
bj.partials(['footer.hbs', 'header.hbs', 'sidebar.hbs']);

// setup metadata
bj.metadata(config);

console.log(bj.metadata());
console.log(bj.partials());
