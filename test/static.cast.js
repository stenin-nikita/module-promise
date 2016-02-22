module.exports = {
    'should return given value if value is a promise-like object' : function(test) {
        var promise = promiseModule.defer().promise;
        test.strictEqual(promiseModule.resolve(promise), promise);
        test.done();
    },

    'should return new promise if givena value is not a promise-like object' : function(test) {
        function isPromise(promise){
            return promise && promise.then;
        }
        test.ok(isPromise(promiseModule.resolve(undefined)));
        test.ok(isPromise(promiseModule.resolve('val')));
        test.ok(isPromise(promiseModule.resolve(5)));
        test.ok(isPromise(promiseModule.resolve(true)));
        test.ok(isPromise(promiseModule.resolve({})));
        test.ok(isPromise(promiseModule.resolve(null)));
        test.ok(isPromise(promiseModule.resolve(function() {})));
        test.done();
    }
};