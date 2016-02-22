module.exports = {
    'resulting promise should be fulfilled after delay' : function(test) {
        var defer = promiseModule.defer(),
            resPromise = defer.promise.delay(30);

        setTimeout(function() {
            test.ok(!(resPromise._status === -1));
            test.ok(!(resPromise._status === 1));
        }, 20);
        setTimeout(function() {
            test.ok(resPromise._status === 1);
            test.strictEqual(resPromise._value, 'ok');
            test.done();
        }, 40);
        defer.resolve('ok');
    },

    'resulting promise should be immediately rejected' : function(test) {
        var defer = promiseModule.defer(),
            resPromise = defer.promise.delay(30);

        setTimeout(function() {
            test.ok(resPromise._status === -1);
            test.strictEqual(resPromise._value, 'error');
            test.done();
        }, 10);

        defer.reject('error');
    }
};