var pathes = require('./lib/pathgen');
var console = require('umd-logger');

function cb(result) {
    var pathes = result.data;
    var engine = result.scion;
    console.info(pathes);
    engine.ignoreScript();
    engine.start();
}

var url = 'http://localhost:9989/scxmlFromMultirep2.xml';
var url = 'http://localhost:9989/telcoPortal-scxmlFromMultirep.xml';
pathes(url, cb);
