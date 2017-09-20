/**
 * 积分商城首页入口
 */


;~function () {
    var app = function () {
        this.coinNumber = $('[data-selector="coin-number"]');
        this.token = JSON.parse( localStorage['token'] );
    };
    app.prototype.init = function () {
        this._listener_login(); //监听登陆
        this._get_user_coin();   //获得用户积分
    };
    /**
     * todo : 获得用积分并显示
     * desc : 获得用户信息并显示，当发生登陆或者登出时候重新执行当前函数，以刷新数据
     * tips : 这是一个支线程序,报错讲不影响主线的使用
     */
    app.prototype._get_user_coin = function () {
        var self = this;
        //检测未登录
        if( ! self.token.login ) return false;
        //检测登陆
        async.waterfall([
            function (cb) {
                $.ajax({url:'member/info/point'}).then( cb );
            }
        ],function (err,ret) {
            if(err) return false;
            self.coinNumber.text( Math.floor( ret || 0 ) );
        });
    };
    /**
     * todo : 监听用户登陆成功，
     * desc : 监听用户登陆成功, 重新获得用户的数据，比如当前用户积分总量
     */
    app.prototype._listener_login = function () {
        var self = this;
        $.logEvent().listenerLogin().then(function () {
            self._get_user_coin();
        });
    };

    $.homeCoin = function () {
        return new app();
    };
}();