module.exports = {
    'resulting promise should not be rejected if argument is not a promise' : function(test) {
        var resPromise = promiseModule.timeout('a', 10);
        setTimeout(function() {
            test.ok(!(resPromise._status === -1));
            test.done();
        }, 20);
    }
};