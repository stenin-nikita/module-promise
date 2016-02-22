module.exports = {
    'resulting promise should be immediately fulfilled if argument is not a promise' : function(test) {
        var promise = promiseModule.fulfill('val');
        test.ok(promise._status === 1);
        test.done();
    },

    'resulting promise should be fulfilled with argument if argument is not a promise' : function(test) {
        promiseModule.fulfill('val').then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'resulting promise should be fulfilled if argument is fulfilled' : function(test) {
        var defer = promiseModule.defer();

        promiseModule.fulfill(defer.promise).then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        defer.resolve('val');
    },

    'resulting promise should be fulfilled if argument is rejected' : function(test) {
        var defer = promiseModule.defer();

        promiseModule.fulfill(defer.promise).then(function(val) {
            test.strictEqual(val, 'error');
            test.done();
        });

        defer.reject('error');
    }
};
