/**
 * Promise Module
 *
 * Copyright (c) 2016 Nikita Stenin (stenin.nikita@gmail.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 0.1.0
 */
(function (root, moduleName, factory) {
    var ns = root.__namespace__ || 'Core';

    if (typeof define === 'function' && define.amd) {
        define(ns + '.' + moduleName, [], function(){
            return factory(root);
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(root);
    } else if(typeof modules === 'object' && typeof modules.define === 'function') {
        modules.define(ns + '.' + moduleName, [], function(provide) {
            provide(factory(root));
        });
    }
    else {
        // define dot notation
        var keys, obj;

        root[ns] = root[ns] || {};
        obj = root[ns];

        keys = moduleName.split('.');
        while (keys.length > 1) {
            moduleName = keys.shift();
            obj[moduleName] = obj[moduleName] || {};
            obj = obj[moduleName];
        }
        obj[keys.shift()] = factory(root);
    }
}(this, 'Promise', function (root) {
    'use strict';

    var
        IS_PROMISE = function(x) {
            return IS_RECEIVER(x) && IS_FUNCTION(x.then);
        },

        IS_OBJECT = function(arg){
            return arg !== null && typeof arg === 'object';
        },

        IS_FUNCTION = function(arg){
            return typeof(arg) === 'function'
        },

        IS_RECEIVER = function(arg){
            return IS_OBJECT(arg) || IS_FUNCTION(arg);
        },

        wrapOnResolved = function(i, res, count, defer){
            return function(val) {
                res[i] = val;
                if(--count) {
                    defer.resolve(res);
                }
            }
        },

        createCallbacks = function(promise) {
            var resolved = false,

                resolve = function(value) {
                    if(resolved) return;
                    resolved = true;
                    promise._resolve(value);
                },

                reject = function(reason) {
                    if(resolved) return;
                    resolved = true;

                    if(IS_PROMISE(reason)) {
                        reason = reason.then(function(val) {
                            var defer = new GlobalPromise(createDeferred);
                            defer.reject(val);
                            return defer.promise;
                        });

                        promise._resolve(reason);
                    }
                    else {
                        promise._reject(reason);
                    }
                },

                notify = function(value) {
                    if(resolved) return;
                    promise._notify(value);
                };

            return {
                resolve: resolve,
                reject: reject,
                notify: notify
            };
        },

        createDeferred = function(promise) {
            var callbacks = createCallbacks(promise);
            callbacks.promise = promise;
            return callbacks;
        },

        nextTick = (function() {
            var fns = [],
                enqueueFn = function(fn) {
                    return fns.push(fn) === 1;
                },
                callFns = function() {
                    var fnsToCall = fns, i = 0, len = fns.length;
                    fns = [];
                    while(i < len) {
                        fnsToCall[i++]();
                    }
                };

            if(typeof setImmediate === 'function') { // ie10, nodejs >= 0.10
                return function(fn) {
                    enqueueFn(fn) && setImmediate(callFns);
                };
            }

            if(typeof process === 'object' && process.nextTick) { // nodejs < 0.10
                return function(fn) {
                    enqueueFn(fn) && process.nextTick(callFns);
                };
            }

            var MutationObserver = root.MutationObserver || root.WebKitMutationObserver; // modern browsers
            if(MutationObserver) {
                var num = 1,
                    node = document.createTextNode('');

                new MutationObserver(callFns).observe(node, { characterData : true });

                return function(fn) {
                    enqueueFn(fn) && (node.data = (num *= -1));
                };
            }

            if(root.postMessage) {
                var isPostMessageAsync = true;
                if(root.attachEvent) {
                    var checkAsync = function() {
                        isPostMessageAsync = false;
                    };
                    root.attachEvent('onmessage', checkAsync);
                    root.postMessage('__checkAsync', '*');
                    root.detachEvent('onmessage', checkAsync);
                }

                if(isPostMessageAsync) {
                    var msg = '__promise' + Math.random() + '_' +new Date,
                        onMessage = function(e) {
                            if(e.data === msg) {
                                e.stopPropagation && e.stopPropagation();
                                callFns();
                            }
                        };

                    root.addEventListener?
                        root.addEventListener('message', onMessage, true) :
                        root.attachEvent('onmessage', onMessage);

                    return function(fn) {
                        enqueueFn(fn) && root.postMessage(msg, '*');
                    };
                }
            }

            var doc = root.document;
            if('onreadystatechange' in doc.createElement('script')) { // ie6-ie8
                var createScript = function() {
                        var script = doc.createElement('script');
                        script.onreadystatechange = function() {
                            script.parentNode.removeChild(script);
                            script = script.onreadystatechange = null;
                            callFns();
                    };
                    (doc.documentElement || doc.body).appendChild(script);
                };

                return function(fn) {
                    enqueueFn(fn) && createScript();
                };
            }

            return function(fn) { // old browsers
                enqueueFn(fn) && setTimeout(callFns, 0);
            };
        })();

    var PROMISE_STATUS = {
        PENDING: 0,
        REJECTED: -1,
        RESOLVED: 1
    };

    var GlobalPromise = function Promise(resolver) {
        if(this === void 0) throw new TypeError('undefined is not a promise');
        if (!(IS_FUNCTION(resolver))) throw new TypeError('Promise resolver '+ String(resolver) +' is not a function');

        this._value = void 0;
        this._status = PROMISE_STATUS.PENDING;
        this._onResolve = [];
        this._onReject = [];
        this._onProgress = [];

        if(resolver === createDeferred) {
            return createDeferred(this);
        }
        var callbacks = createCallbacks(this);

        try {
            resolver(callbacks.resolve, callbacks.reject, callbacks.notify);
        } catch (e) {
            callbacks.reject(e);
        }
    };

    GlobalPromise.prototype = {
        constructor : GlobalPromise,

        then : function(onResolve, onReject, onProgress) {
            if (this._status === void 0) {
                throw new TypeError(String(this) + " is not a promise");
            }

            onResolve = IS_FUNCTION(onResolve) ? onResolve : function(x) { return x; };
            onReject = IS_FUNCTION(onReject) ? onReject : function(r) { throw r; };
            onProgress = IS_FUNCTION(onProgress) ? onProgress : function(x) { return x; };

            var defer = new GlobalPromise(createDeferred), task;

            if(this._status !== PROMISE_STATUS.REJECTED) {
                task = {handler: onResolve, deferred: defer};
                this._status == PROMISE_STATUS.RESOLVED ?
                    this._enqueue(this._value, [task]) : this._onResolve.push(task);
            }

            if(this._status !== PROMISE_STATUS.RESOLVED) {
                task = {handler: onReject, deferred: defer};
                this._status == PROMISE_STATUS.REJECTED ?
                    this._enqueue(this._value, [task]) : this._onReject.push(task);
            }

            if(this._status === PROMISE_STATUS.PENDING) {
                this._onProgress.push({handler: onProgress, deferred: defer});
            }

            return defer.promise;
        },

        chain : function(onResolve, onReject, onProgress) {
            return this.then(onResolve, onReject, onProgress);
        },

        'catch' : function(onReject) {
            return this.then(void 0, onReject);
        },

        _resolve : function(x) {
            if (x === this) {
                this._reject((new TypeError('Chaining cycle detected for promise ' + String(x))));
                return;
            }

            var then, callbacks;

            if (IS_RECEIVER(x)) {
                try {
                    then = x.then;
                } catch(e) {
                    this._reject(e);
                    return;
                }

                if (IS_FUNCTION(then)) {
                    callbacks = createCallbacks(this);
                    try {
                        then.call(x, callbacks.resolve, callbacks.reject, callbacks.notify);
                    } catch(e) {
                        callbacks.reject(e);
                    }

                    return;
                }
            }

            this._done(PROMISE_STATUS.RESOLVED, x, '_onResolve');
        },

        _reject : function(r) {
            this._done(PROMISE_STATUS.REJECTED, r, '_onReject');
        },

        _notify : function(value) {
            if (this._onProgress.length) this._enqueue(value, this._onProgress);
        },

        _done : function(status, value, promiseQueue) {
            if (this._status === PROMISE_STATUS.PENDING) {
                var tasks = this[promiseQueue];
                if (tasks.length) this._enqueue(value, tasks);

                this._status = status;
                this._value = value;
                this._onResolve = this._onReject = this._onProgress = void 0;
            }
        },

        _enqueue : function(value, tasks) {
            var len = tasks.length, _this = this, i = 0;
            nextTick(function() {
                while(i < len) {
                    _this._handle(tasks[i], value);
                    i += 1;
                }
            });
        },

        _handle : function(task, value) {
            var result;

            try {
                result = task.handler.call(void 0, value);
                (PROMISE_STATUS.PENDING !== this._status) ?
                    task.deferred.resolve(result) :
                    task.deferred.notify(result);
            }
            catch (exception) {
                try { task.deferred.reject(exception); } catch (e) { }
            }
        },

        /**
         * Non standart
         */
        progress : function(onProgress) {
            return this.then(void 0, void 0, onProgress);
        },

        fail : function(onReject) {
            return this.then(void 0, onReject);
        },

        done : function(onResolved, onRejected, onProgress) {
            this.then(onResolved, onRejected, onProgress).fail(function(e) {
                nextTick(function() {
                    throw e;
                });
            });
        },

        always : function(onResolved) {
            var _this = this,
                cb = function() {
                    return onResolved.call(this, _this);
                };

            return this.then(cb, cb);
        },

        spread : function(onResolved, onRejected, onProgress) {
            return this.then(
                function(val) {
                    return onResolved.apply(this, val);
                },
                onRejected,
                onProgress
            );
        },

        delay : function(delay) {
            var timer, defer, _this = this,
                promise = this.then(function(val) {
                    defer = new GlobalPromise(createDeferred);
                    timer = setTimeout(function() {
                        defer.resolve(val);
                    }, delay);

                    return defer.promise;
                });

            promise.always(function() {
                clearTimeout(timer);
            });

            return promise;
        },

        timeout : function(timeout) {
            var defer = new GlobalPromise(createDeferred),
                timer = setTimeout(function() {
                    defer.reject(new Error('timed out'));
                }, timeout);

            this.then(
                function(val) {
                    defer.resolve(val);
                },
                function(reason) {
                    defer.reject(reason);
                }
            );

            defer.promise.always(function() {
                clearTimeout(timer);
            });

            return defer.promise;
        }
    };

    GlobalPromise.all = function(iterable) {
        if (!IS_RECEIVER(this)) {
            throw new TypeError('Promise.all called on non-object');
        }

        var defer = new GlobalPromise(createDeferred),
            len = iterable.length,
            res = [],
            count = res.length,
            i = 0;

        if(!len) {
            defer.resolve(res);
            return defer.promise;
        }

        while(i < len) {
            GlobalPromise.resolve(iterable[i]).then(
                wrapOnResolved(i, res, count, defer),
                defer.reject,
                defer.notify
            );
            ++i;
        }

        return defer.promise;
    };

    GlobalPromise.defer = function() {
        return new GlobalPromise(createDeferred);
    };

    GlobalPromise.race = function(iterable) {
        if (!IS_RECEIVER(this)) {
            throw new TypeError(String(this) + ' called on non-object');
        }

        var value,
            deferred = new GlobalPromise(createDeferred);

        try {
            for (var i = 0; i < iterable.length; i++) {
                value = iterable[i];
                this.resolve(value).then(deferred.resolve, deferred.reject, deferred.notify);
            }
        } catch(e) {
            deferred.reject(e)
        }

        return deferred.promise;
    };

    GlobalPromise.resolve = function(x) {
        if (!IS_RECEIVER(this)) {
            throw new TypeError(String(this) + ' called on non-object');
        }
        if (IS_PROMISE(x) && x.constructor === this) return x;

        var defer = new GlobalPromise(createDeferred);
        defer.resolve(x);

        return defer.promise;
    };

    GlobalPromise.reject = function(r) {
        if (!IS_RECEIVER(this)) {
            throw new TypeError(String(this) + ' called on non-object');
        }

        var defer = new GlobalPromise(createDeferred);
        defer.reject(r);
        return defer.promise;
    };

    GlobalPromise.accept = function(x) { return this.resolve(x); };

    /**
     * Non standart
     */
    GlobalPromise.fulfill = function(value) {
        var defer = new GlobalPromise(createDeferred),
            promise = defer.promise;

        defer.resolve(value);

        return promise._status === PROMISE_STATUS.RESOLVED ?
            promise :
            promise.then(null, function(reason) {
                return reason;
            });
    };

    GlobalPromise.when = function(value, onResolved, onRejected, onProgress) {
        return this.resolve(value).then(onResolved, onRejected, onProgress);
    };

    GlobalPromise.fail = function(value, onRejected) {
        return this.resolve(value).then(void 0, onRejected);
    };

    GlobalPromise.always = function(value, onResolved) {
        return this.resolve(value).always(onResolved);
    };

    GlobalPromise.spread = function(value, onResolved, onRejected, onProgress) {
        return this.resolve(value).spread(onResolved, onRejected, onProgress);
    };

    GlobalPromise.done = function(value, onResolved, onRejected, onProgress) {
        return this.resolve(value).done(onResolved, onRejected, onProgress);
    };

    GlobalPromise.delay = function(value, delay) {
        return this.resolve(value).delay(delay);
    };

    GlobalPromise.timeout = function(value, timeout) {
        return this.resolve(value).timeout(timeout);
    };

    GlobalPromise.progress = function(value, onProgress) {
        return this.resolve(value).progress(onProgress);
    };

    return GlobalPromise;
}));