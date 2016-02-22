module.exports = {
    'should return undefined if promise is unresolved' : function(test) {
        var promise = promiseModule.defer().promise;

        test.strictEqual(promise._value, undefined);
        test.done();
    },

    'should return value of fulfillment if promise if fulfilled' : function(test) {
        var defer = promiseModule.defer();

        defer.resolve('ok');

        test.strictEqual(defer.promise._value, 'ok');
        test.done();
    },

    'should return reason of rejection if promise if rejected' : function(test) {
        var defer = promiseModule.defer(),
            error = Error();

        defer.reject(error);

        test.strictEqual(defer.promise._value, error);
        test.done();
    }
};