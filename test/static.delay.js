module.exports = {
    'resulting promise should be fulfilled with first argument if argument is not a promise' : function(test) {
        var resPromise = promiseModule.delay('ok', 10);
        setTimeout(function() {
            test.ok(resPromise._status === 1);
            test.ok(resPromise._value === 'ok');
            test.done();
        }, 20);
    }
};