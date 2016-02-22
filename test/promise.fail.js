module.exports = {
    'onRejected callback should be called on reject' : function(test) {
        var defer = promiseModule.defer();

        defer.reject('error');
        defer.promise.fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });
    }
};