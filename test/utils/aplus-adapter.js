var promiseModule = require('../../');

module.exports = {
    resolved : function(val) {
        var defer = promiseModule.defer();
        defer.resolve(val);
        return defer.promise;
    },

    rejected : function(reason) {
        var defer = promiseModule.defer();
        defer.reject(reason);
        return defer.promise;
    },

    deferred : function() {
        var defer = promiseModule.defer();
        return {
            promise : defer.promise,

            resolve : function(val) {
                defer.resolve(val);
            },

            reject : function(reason) {
                defer.reject(reason);
            }
        };
    }
};