module.exports = {
    defersToPromises : function(defers) {
        if(Array.isArray(defers)) {
            return defers.map(function(defer) {
                return defer && defer.promise ?
                    defer.promise :
                    defer;
            });
        }

        var res = {};
        Object.keys(defers).forEach(function(key) {
            res[key] = defers[key] && defers[key].promise ?
                defers[key].promise :
                defer;
        });
        return res;
    }
};