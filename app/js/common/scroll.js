

;~function () {

    var app = function () {

    };
    app.prototype.init = function () {

    };
    /**
     * todo : 添加监听滚动到底部事件
     * @param callback : function 滚动到底部后的执行回调函数
     */
    app.prototype.addListenerToBottom = function (callback) {
        callback = $.callback(callback);
        api.addEventListener({
            name:'scrolltobottom',
            extra:{
                threshold : $.config.threshold ? $.config.threshold : 30            //设置距离底部多少距离时触发，默认值为0，数字类型
            }
        }, function(){
            callback()
        });
    };
    /**
     * todo : 移除监听滚动到底部事件
     */
    app.prototype.removeListenerToBottom = function () {
        api.removeEventListener({name:'scrolltobottom'});
    };
    return $.scroll = function () {
        return new app();
    };
}();