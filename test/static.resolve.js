module.exports = {
    'resulting promise should be fulfilled if argument is non-promise' : function(test) {
        promiseModule.resolve('val').then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'resulting promise should be fulfilled if argument is fulfilled' : function(test) {
        var defer = promiseModule.defer();

        promiseModule.resolve(defer.promise).then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        defer.resolve('val');
    },

    'resulting promise should be rejected if argument is rejected' : function(test) {
        var defer = promiseModule.defer();

        promiseModule.resolve(defer.promise).then(null, function(val) {
            test.strictEqual(val, 'error');
            test.done();
        });

        defer.reject('error');
    }
};