;~function () {

    var app = function () {
        this.bMap = api.require('bMap');
        return this;
    };
    app.prototype._get_user_location = function (callback) {
        var self = this;
        callback = $.callback( callback );
        self.bMap.getLocation({
            accuracy: '100m',
            autoStop: true,
            filter: 1
        }, function(ret, err) {
            callback(err,ret);
        });
    };
    return $.bMap = function () {
        return new app();
    };
}();