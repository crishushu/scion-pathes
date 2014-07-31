# scion-pathes

Shortest path calculation of state nodes in SCION-based (creator is Jacob Beard) SCXML models.

## Documentation
This is a SCION-based implementation for calculating the shortest path to a SCXML state. 
In the current implementation a path is solely defined by event names – the condition attribute of a transition is not supported yet. In practice, the function takes a SCXML document as a parameter and returns a JavaScript object with state ids as properties where each contains useful information about itself, i.e., the event path. The background of this implementation was to be able to externally simulate a SCXML-based application. 

The implementation is UMD-enabled.

## Getting Started
Install the module with: `npm install scion-pathes`

##### Start path calculation using UMD pattern

```javascript
(function(global, factory) {
    if (typeof module === 'object') {
        factory(require('umd-logger'), require('scion-pathes'));
    } else if (typeof define === 'function' && define.amd) {
        define(['umd-logger', 'scion-pathes'], factory);
    } else {
        factory(umd_logger, global.scionPathes);
    }
})(this, function(console, pathgen) {
    var url = (typeof module === 'object') ? 'http://localhost:9989/example-scxml.xml': 'http://localhost:5951/scxml/docs/example-scxml.xml';

    pathgen.init(url).start(function(result){
        var pathes = result.data;
        var engine = result.scion;
        console.info(pathes);
    });
});
```
##### To test the implementation using node
1. Set the path to your node_modules containing the required grunt plugins (see package.json) inside Gruntfile.js
2. Type in your command line: `grunt`

You can also just execute with `node usage`. Though, before you need to start the file server that serves the SCXML document. To this end you go to the folder scxml and type in your terminal: `node file-server`


##### To test the implementation using globals
1. Set the path to your node_modules containing the required grunt plugins (see package.json) inside Gruntfile.js
2. Open index.html (check inside the parent folder) and adapt comment as below
3. Type in your command line: `grunt serve:browser`

```html
<script type="text/javascript" src="node_modules/umd-logger/lib/umd-logger.js" />
<script type="text/javascript" src="node_modules/message-bus/lib/message-bus.js" />
<script type="text/javascript" src="node_modules/scion-x/lib/scionLoader.js" />
<script type="text/javascript" src="lib/pathgen.js" />
<script type="text/javascript" src="./usage.js" />
```


##### To test the implementation using AMD
1. Set the path to your node_modules containing the required grunt plugins (see package.json) inside Gruntfile.js
2. Open index.html and adapt index.html as below 
3. Type in your command line: `grunt serve:browser`

```HTML
 <script type="text/javascript">
  var require = {
    paths: {
        'pathgen': './lib/pathgen',
        'simulator': './lib/simulator',
        'generator': './lib/generator',        
        'umd-logger': './node_modules/umd-logger/lib/umd-logger',
        'message-bus': './node_modules/message-bus/lib/message-bus',
        'scion': './node_modules/scion/dist/scion',
        'scion-x': './node_modules/scion-x/lib/scionLoader',
        'scionWrapper': './node_modules/scion-x/lib/scionWrapper'
    },
    deps: ['usage']
  }
 </script>
 <script type="text/javascript" src="require.js"></script>
```


## License
Copyright (c) 2014 Christian H. Schulz  
Licensed under the MIT license.

<!--
## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

-->