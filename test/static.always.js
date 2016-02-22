module.exports = {
    'onResolved callback should be called when argument fulfilled' : function(test) {
        var defer = promiseModule.defer();

        promiseModule.always(defer.promise, function(promise) {
            test.ok(promise._status === 1);
            test.strictEqual(promise._value, 'ok');
            test.done();
        });

        defer.resolve('ok');
    },

    'onResolved callback should be called when argument rejected' : function(test) {
        var defer = promiseModule.defer();

        promiseModule.always(defer.promise, function(promise) {
            test.ok(promise._status === -1);
            test.strictEqual(promise._value, 'err');
            test.done();
        });

        defer.reject('err');
    },

    'onResolved callback should be called when argument is non-promise' : function(test) {
        promiseModule.always('ok', function(promise) {
            test.ok(promise._status === 1);
            test.strictEqual(promise._value, 'ok');
            test.done();
        });
    }
};

