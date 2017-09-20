/**
 * @用于处理登陆登出事件的广播与接受
 *
 */
;~function () {

    var app = function () {
        this.callback = function () {};
    };
    /**
     * todo : 发送登陆成功广播
     * desc : 发送登陆成功广播,并携带所有的用户信息，和提示
     * @param ret : object [登陆成功后的返回消息内容，包括状态与数据]
     */
    app.prototype.sendLogin = function (ret ) {
        var self = this;
        self.success(ret);
        $.api.sendEvent('_event_login' , ret || {});
    };
    /**
     * todo : 接收登陆成功的广播
     * desc : 接收登陆成功的广播,并且在回调函数中获得所有的数据
     * @param callback
     */
    app.prototype.listenerLogin = function (callback) {
        var self = this;
        if( typeof callback === typeof void 0 && typeof callback == 'function') return $.api.listenerEvent('_event_login' , function (ret) {
            callback(ret);
        });
        $.api.listenerEvent('_event_login' , function (ret) {
            self.callback( null , ret );
        });
        return self;
    };
    /**
     * todo : 发送用户登出事件
     * desc : 发送用户登出事件，发送用户的状态
     * @param ret :object [登陆成出后的返回消息内容，包括状态与数据]
     */
    app.prototype.sendLogout = function (ret) {
        var self = this;
        $.api.sendEvent('login' , ret || {});
        self.success(ret);
    };

    /**
     * todo : 登陆登出的执行函数
     * desc : 用于操作本地token 以及 弹出提示
     * @param ret
     */
    app.prototype.success = function (ret) {
        $.api.toast('登陆成功');
        localStorage.token = JSON.stringify( ret );
    };
    /**
     * then函数
     * @param callback
     */
    app.prototype.then = function (callback) {
        this.callback = $.callback(callback);
    };
    $.logEvent = function () {
        return new app();
    };
}();