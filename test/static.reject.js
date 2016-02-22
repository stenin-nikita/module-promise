module.exports = {
    'resulting promise should be immediately rejected' : function(test) {
        var promise = promiseModule.reject('error');
        test.ok(promise._status === -1);
        test.done();
    },

    'resulting promise should be rejected with argument if argument is not a promise' : function(test) {
        promiseModule.reject('error').fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });
    },

    'resulting promise should be rejected if argument is rejected' : function(test) {
        var defer = promiseModule.defer();

        promiseModule.reject(defer.promise).fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });

        defer.reject('error');
    },

    'resulting promise should be rejected if argument is fulfilled' : function(test) {
        var defer = promiseModule.defer();

        promiseModule.reject(defer.promise).fail(function(error) {
            test.strictEqual(error, 'val');
            test.done();
        });

        defer.resolve('val');
    }
};
