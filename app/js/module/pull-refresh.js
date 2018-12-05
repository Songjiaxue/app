/**
 * todo : 下拉刷新模块配置
 *
 *
 */
;~function () {

    var app = function () {};
    /**
     * todo : 配置下拉刷新
     * @param callback 到达阈值执行的回调函数
     */
    app.prototype.set = function (callback) {
        callback = $.callback(callback);
        api.setCustomRefreshHeaderInfo({
            bgColor: 'rgba(0,0,0,0)',
            image: $.config.pullRefresh
        }, function() {
            $.api.toast('刷新成功');
            callback();
        });
    };
    /**
     * todo : 手动关闭下拉刷新
     */
    app.prototype.close = function () {
        setTimeout(api.refreshHeaderLoadDone , 500);
    };
    return $.pullRefresh = function () {
        return new app();
    };
}();