<a href="http://promises-aplus.github.com/promises-spec"><img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png" align="right"></a>

# Module Promise
[![travis][travis-image]][travis-url]
[![dep][dep-image]][dep-url]
[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]

[travis-image]: https://img.shields.io/travis/stenin-nikita/module-promise.svg?style=flat
[travis-url]: https://travis-ci.org/stenin-nikita/module-promise
[dep-image]: https://img.shields.io/david/stenin-nikita/module-promise.svg?style=flat
[dep-url]: https://david-dm.org/stenin-nikita/module-promise
[npm-image]: https://img.shields.io/npm/v/module-promise.svg?style=flat
[npm-url]: https://npmjs.org/package/module-promise
[downloads-image]: https://img.shields.io/npm/dm/module-promise.svg?style=flat
[downloads-url]: https://npmjs.org/package/module-promise

Getting Started
---
### Install with NPM
    $ npm install module-promise
### Install with Bower
    $ bower install module-promise
### In Browsers
```html
<script type="text/javascript" src="promise.min.js"></script>
```
Usage
---
```js
// Node.js
var Promise = require('module-promise');

// Global Window in Browsers
var Promise = Core.Promise;

// RequireJS
require('Core.Promise', function(Promise){
    // do something
});

// Yandex modules
modules.require('Core.Promise', function(Promise){
    // do something
});
```
### new Promise(resolver)
```js
var doSomethingAsync = new Promise(function(resolve, reject, notify){
    // resolve('ok');
    // reject(new Error('Custom error'));
    // notify('val');
});

doSomethingAsync.then(
    function() {}, // onResolved
    function() {}, // onRejected
    function() {}  // onNotified
);
```
### Promise.defer
```js
function doSomethingAsync() {
    var deferred = Promise.defer();

    // deferred.resolve('ok');
    // deferred.reject(new Error('Custom error'));
    // deferred.notify('val');

    return deferred.promise;
}

doSomethingAsync().then(
    function() {}, // onResolved
    function() {}, // onRejected
    function() {}  // onNotified
);
```

License
---
The Promise module is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
