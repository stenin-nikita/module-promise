var defersToPromises = require('./utils/helpers').defersToPromises;

module.exports = {
    'for Array' : {
        'resulting defer should be fulfilled after all defers fulfilled' : function(test) {
            var defers = [promiseModule.defer(), promiseModule.defer(), promiseModule.defer()];

            promiseModule.all(defersToPromises(defers)).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2]);
                test.done();
            });

            defers.forEach(function(defer, i) {
                defer.resolve(i);
            });
        },

        'resulting defer should be rejected if any defer rejected' : function(test) {
            var defers = [promiseModule.defer(), promiseModule.defer(), promiseModule.defer()],
                error = new Error('error');

            promiseModule.all(defersToPromises(defers)).then(null, function(_error) {
                test.deepEqual(_error, error);
                test.done();
            });

            defers.forEach(function(defer, i) {
                i % 2? defer.resolve() : defer.reject(error);
            });
        },

        'resulting defer should be fulfilled if argument is empty array' : function(test) {
            promiseModule.all([]).then(function(vals) {
                test.deepEqual(vals, []);
                test.done();
            });
        },

        'resulting defer should be notified if argument if any defer notified' : function(test) {
            var defers = [promiseModule.defer(), promiseModule.defer(), promiseModule.defer()],
                i = 0;

            promiseModule.all(defersToPromises(defers)).progress(function(val) {
                test.equal(val, i);
                (++i === defers.length) && test.done();
            });

            defers.forEach(function(defer, i) {
                defer.notify(i);
            });
        },

        'arguments can contains non-defer items' : function(test) {
            var defers = [0, promiseModule.defer(), promiseModule.defer(), 3, undefined];

            promiseModule.all(defersToPromises(defers)).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2, 3, undefined]);
                test.done();
            });

            defers[1].resolve(1);
            defers[2].resolve(2);
        }
    }
};
