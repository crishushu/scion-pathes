var getConfig = function(console) {
    
    console.setLevel(3);

    return {
        doc: '',
        evalScript: false,
        scionListener: {
            statesActive: [],
            onEntry: function(stateName) {
                this.statesActive.push(stateName);
                console.debug('SCXML State Entry: "' + stateName + '"');
            },
            onExit: function(stateName) {
                this.statesActive.pop();
                console.debug('SCXML State Exit: "' + stateName + '"');
            },
            onTransition: function(sourceState, targetStatesArray) {
                console.debug('SCXML State Transition: "' + sourceState + '"->"' + targetStatesArray + '"');
                if (targetStatesArray && targetStatesArray.length > 1) {
                    console.warn('SCXML State Transition: multiple target states!');
                }
            }
        },
        onraise: function(e) {
            MessageBus.fire('transitionFinished', e);
            console.debug('current state:', this.getStateName());
            console.debug('active states:', this.getActiveStatesName());
            console.debug('active events:', this.getActiveEvents());
            console.debug('active transitions:', this.getStateName() + ":" + JSON.stringify(this.getActiveTransitions()));
        }
    };
};
if (typeof module === 'object') {
    module.exports = function(url, callback) {
        var console = require('umd-logger');
        console.setLevel(3);
        var config = getConfig(console);
        config.doc = url;
        config.onraise = function(e) {
            require('message-bus').fire('transitionFinished', e);
            console.debug('current state:', this.getStateName());
            console.debug('active states:', this.getActiveStatesName());
            console.debug('active events:', this.getActiveEvents());
            console.debug('active transitions:', this.getStateName() + ":" + JSON.stringify(this.getActiveTransitions()));
        };
        require('scion-x')(config).init(function(engine) {
            engine.setDataModel('console', console);
            var gen = require('./generator').init(engine, require('./simulator').init(engine));
            gen.start().done(callback);
        });
    };
} else if (typeof define === 'function' && define.amd) {
    define(['scion-x', 'umd-logger', 'simulator', 'generator'], function(scionx, console, simulator, generator) {
        console.setLevel(3);
        return function(url, callback) {
            var config = getConfig(console);
            scionx(config).init(function(engine) {
                var gen = generator.init(engine, simulator.init(engine));
                gen.start().done(callback);
            });
        };
    });
} else {
    window.pathgen = function(url, callback) {
        window.scionx(config).init(function(engine) {
            pathgen = {};
            $.when($.getScript("./lib/simulator.js"), $.getScript("./lib/generator.js")).done(function() {
                var gen = pathgen.generator.init(engine, pathgen.simulator.init(engine));
                gen.start().done(callback);
            });
        });
    };
}