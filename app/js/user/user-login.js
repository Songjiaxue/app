;~function () {

    var app = function () {
        this.$url = 'member/login/login';
        this.$tel = $('[data-selector="tel"]');
        this.$pwd = $('[data-selector="pwd"]');
        this.$submit = $('[data-selector="submit"]');

        this.$logEvent = $.logEvent();
    };

    app.prototype.init = function () {
        alert('login');
        this._event();
    };

    app.prototype._event = function () {
        var self = this;
        self.$submit.on('tap' , function () {
            self._login();
        });
    };

    app.prototype._login = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self._ajax(cb);
            }
        ],function (err,ret) {
            if(err) return $.api.toast(err);
            self.$logEvent.sendLogout(ret);
        });
    };
    app.prototype._ajax = function (callback) {
        var self = this;
        callback = $.callback( callback );
        var data = {
            tel : self.$tel.val(),
            password : self.$pwd.val()
        };
        if( data['tel'].length != 11 || !data['password']) return callback('用户名或者密码不正确');
        $.ajax({
            url : self.$url,
            data : data
        }).then( callback );
    };

    return $.userLogin = function () {
        return new app();
    };
}();