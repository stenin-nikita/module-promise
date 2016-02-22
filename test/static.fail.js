module.exports = {
    'onRejected callback should be called when argument rejected' : function(test) {
        var defer = promiseModule.defer();

        promiseModule.fail(defer.promise, function(error) {
            test.strictEqual(error, 'err');
            test.done();
        });

        defer.reject('err');
    }
};