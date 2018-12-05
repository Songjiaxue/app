;~function () {
    return $.callback = function (callback) {
        return callback = typeof callback === 'function' ? callback : function () {};
    };
}();
