(function(global, factory) {
    if (typeof module === 'object') {
        var logger,
            messageBus;
        logger = require('umd-logger');
        messageBus = require('message-bus');
        module.exports = factory(logger, messageBus);
    } else if (typeof define === 'function' && define.amd) {
        //TODO
        define([''], factory);
    } else {
        global.pathgen = global.pathgen || {};
        pathgen.simulator = factory(console, MessageBus);
    }
})(this, function(console, MessageBus) {
    var _instance = null;
    var newInstance = function(engine) {
        var paused = false,
            path = [];
        var play = function(arg) {
            path = arg || this.rec.path;
            var event;
            if (path.length === 0) {
                console.log('there is nothing to record');
                reset.call(this);
                MessageBus.fire('playbackFinished');
                return;
            }
            MessageBus.register('transitionFinished', next, _instance);
            event = path.splice(0, 1)[0];
            engine.raise(event); // first time firing event
        };
        var next = function() {
            if (!paused) {
                var event; // = ev.name;
                if (path.length > 0) {
                    event = path.splice(0, 1)[0];
                } else {
                    reset.call(this);
                    MessageBus.fire('playbackFinished');
                    return;
                }
                engine.raise(event); // fire subsequent event
            }
        };
        var stop = function() {
            MessageBus.remove('playbackFinished');
            MessageBus.remove('transitionFinished');
            _instance.rec.path = [];
            path = [];
        };
        var pause = function() {
            if (paused) {
                paused = false;
                next();
            } else {
                paused = true;
            }
        };
        var reset = function() {
            path = [];
            MessageBus.remove('transitionFinished', _instance, next);
            MessageBus.remove('transitionFinished', _instance.rec, _instance.rec.save);
        };
        var rec = {
            start: function() {
                MessageBus.register('transitionFinished', this.save, this);
            },
            save: function(data) {
                this.path.push(data.name);
            },
            path: []
        };
        return {
            rec: rec,
            play: play,
            stop: stop,
            pause: pause
        };
    };
    console.debug("load: simulator");
    return {
        init: function(engine) {
            if (engine) {
                _instance = newInstance(engine);
            } else if (!_instance) {
                console.warn('instance of scionEngine is needed as param');
                return;
            }
            return _instance;
        },
    };
});