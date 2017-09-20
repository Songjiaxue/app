;~function () {

    var app = function () {
        this.$login = JSON.parse( localStorage['token'] );
        this.$text = $('[data-selector="text"]');
    };
    app.prototype.init = function () {
        var self = this;
        self._main();
    };
    app.prototype._main = function () {
        var self = this;
        !!self.$login['login'] ? self._login() : self._logout();
    };
    app.prototype._login = function () {
        var self = this;
        self.$text.text('登出').on('tap' , function () {
            //登出操作
            self._out();
        });
    };
    app.prototype._out = function () {
        alert('登出');
    };
    app.prototype._logout = function () {
        var self = this;
        self.$text.text('登录').on('tap' , function () {
            $.app.switch('openNewWin' , {
                name : 'win_user_login'
            });
        });
    };
    return $.setIndex = function () {
        return new app();
    };
}();