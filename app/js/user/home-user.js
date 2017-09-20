;~function () {
    var app = function () {
        this.$login = $('[data-selector="login"]');
        this.$logout = $('[data-selector="logout"]');
        this.$avatar = $('[data-selector="avatar"]');
        this.$signature = $('[data-selector="signature"]');
        this.$nick = $('[data-selector="nick"]');
    };
    app.prototype.init = function () {
        this._main();
        this._listener_log();
    };
    /**
     * todo : 获得用户信息
     * desc : 根据本地缓存的用户token获得并设置用户信息
     */
    app.prototype._main = function () {
        var self = this;
        self._user_info();
    };
    app.prototype._user_info = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self._ajax( cb )
            },
            function ( ret , cb ) {
                self._set_user_info( ret , cb );
            }
        ],function (err) {
            $.api.toast(err);
            if(err){
                self.$login.hide();
                return self.$logout.show();
            };
            self.$login.show();
            self.$logout.hide();
        });
    };
    /**
     * todo : 用户信息接口请求
     * desc : 请求用户信息
     * @param callback
     */
    app.prototype._ajax = function (callback) {
        $.ajax({url : 'member/info/user'}).then( callback );
    };
    /**
     * todo : 设置用户信息
     * desc : 设置用户信息以及头像等信息
     * @param ret
     * @param callback
     */
    app.prototype._set_user_info = function (ret,callback) {
        var self = this;
        self.$nick.html( ret.nick || '佚名' );
        self.$signature.html( ret.signature || 'HI ，欢迎来美乐吧做客！');
        self.$avatar.css({
            'background-image' : 'url("'+ ( !!ret.avatar ? ret.avatar :  '../images/icon.png' ) +'")' // TODO: 头像
        });
        callback(null , ret);
    };
    /**
     * todo : 设置登陆登出的监听
     * desc : 当发生登陆时，重新请求用户信息 or 当发生登出时，清楚登陆条件
     */
    app.prototype._listener_log = function () {
        var self = this;
        //监听登陆
        $.logEvent().listenerLogin().then(function () {
            self._user_info();
        });
        //监听登出
        $.logEvent().listenerLogin().then(function () {
            self._user_info();
        });
    };
    return $.homeUser = function () {
        return new app();
    };
}();