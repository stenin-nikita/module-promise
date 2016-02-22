module.exports = {
    'exception should be throwed if argument is a promise' : function(test) {
        var defer = promiseModule.defer(),
            e = Error();

        defer.reject(e);
        promiseModule.done(defer.promise);

        process.once('uncaughtException', function(_e) {
            test.strictEqual(_e, e);
            test.done();
        });
    },

    'nothing to be happen if argument is not a promise' : function(test) {
        promiseModule.done('val');
        test.done();
    }
};