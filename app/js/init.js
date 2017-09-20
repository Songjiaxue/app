;(function () {

    var app = function () {
        this.welcome = localStorage.welcome;
        this.accessToken;
        this.init();
    };
    /**
     * todo : 验证welcome && token , 执行$.main函数
     * desc : self._token && $.main
     */
    app.prototype.init = function () {
        var self = this;
        self.accessToken = typeof self.welcome == typeof void 0 ? typeof void 0 : JSON.parse( localStorage.token );
        self._token();
        $.main();
    };
    /**
     * todo : 验证本地token , 不存在或者过期 ，
     * desc : 本地token不为object时候,且token与expire存在，且expire未过期时
     * @private
     */
    app.prototype._token = function () {
        var self = this;
        if(typeof self.accessToken != 'object') return self._reset_token();
        if(typeof self.accessToken.token == typeof void 0 || typeof self.accessToken.expire == typeof void 0  ) return self._reset_token();
        if( self.accessToken.expire - 3600  > self._time() ) return false;
        $.api.toast('用户信息失效，已经登出登陆');
        return self._reset_token();
    };
    /**
     * todo : 重设localStorage.token
     * desc : localStorage.token = {  token : 0 , expire : time() + 30天 , login : false }
     * @private
     */
    app.prototype._reset_token = function () {
        var self = this;
        localStorage.token = JSON.stringify({token:0,expire:self._time() + 2592000,login : false});
    };
    /**
     * todo : 获取当前时间unix时间戳
     * @returns {number} time();
     * @private
     */
    app.prototype._time = function () {
        return Math.round(new Date().getTime()/1000);
    };
    $.init = function () {
        return new app();
    };
}());