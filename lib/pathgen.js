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
        onraise: (function() {
                    function fn (console, messageBus) {
                        return function (e) {
                            messageBus.fire('transitionFinished', e);
                            console.debug('current state:', this.getStateName());
                            console.debug('active states:', this.getActiveStatesName());
                            console.debug('active events:', this.getActiveEvents());
                            console.debug('active transitions:', this.getStateName() + ":" + JSON.stringify(this.getActiveTransitions()));
                        };
                    }

                    if (typeof module === 'object') {
                        return fn(require('umd-logger'), require('message-bus'));
                    } else if (typeof define === 'function' && define.amd) {
                        var console = require('umd-logger');
                        var messageBus = require('message-bus');                                
                        return fn (console, messageBus);
                    } else {
                        return fn(umd_logger, MessageBus);
                    }                    
                }())
        };
};
if (typeof module === 'object') {
    module.exports = {
        init: function(url) {
            var console = require('umd-logger');
            var scionx = require('scion-x');
            console.setLevel(3);
            var config = getConfig(console);
            config.doc = url;

            return {
                start: function(callback) {
                    scionx(config).init(function(engine) {
                        engine._scion.model.datamodel['console'] = console;
                        var gen = require('./generator').init(engine, require('./simulator').init(engine), require('jquery-deferred').Deferred());
                        console.info('calculating pathes ...');
                        gen.start().done(callback);
                    });
                }
            };
        }
    };

} else if (typeof define === 'function' && define.amd) {
    define(['scion-x', 'umd-logger', 'simulator', 'generator'], function(scionx, console, simulator, generator) {        
        console.setLevel(3);

        return {
            init: function(url) {
                var config = getConfig(console);
                config.doc = url;
                return {
                    start: function(callback){
                        scionx(config).init(function(engine) {
                            var gen = generator.init(engine, simulator.init(engine), $.Deferred());
                            console.info('calculating pathes ...');
                            gen.start().done(callback);
                        });
                    }
                };
            }
        };
    });
} else {
    window.pathgen = window.pathgen || {};
    window.pathgen.init = function(url) {
        var config = getConfig(umd_logger);
        config.doc = url;

        return {
            start: function (callback) {
                window.scionx(config).init(function(engine) {
                    $.when(
                        $.getScript("./lib/simulator.js"), 
                        $.getScript("./lib/generator.js"))
                    .done(function() {
                        var gen = pathgen.generator.init(engine, pathgen.simulator.init(engine), $.Deferred());
                        console.info('calculating pathes ...');
                        gen.start().done(callback);
                    });
                });
            }
        };
    };
 }
