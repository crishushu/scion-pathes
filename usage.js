(function(global, factory) {
    if (typeof module === 'object') {
        factory(require('umd-logger'), require('./lib/pathgen'));
    } else if (typeof define === 'function' && define.amd) {
        define(['umd-logger', 'pathgen'], factory);
    } else {
        factory(umd_logger, pathgen);
    }
})(this, function(console, pathgen) {
    var url = (typeof module === 'object') ? 'http://localhost:9989/example-scxml.xml': 'http://localhost:5951/scxml/docs/example-scxml.xml';

    pathgen.init(url).start(function(result){
        var pathes = result.data;
        var engine = result.scion;
        console.info(pathes);
        engine.evaluateScript();
        engine.start();
    });
});