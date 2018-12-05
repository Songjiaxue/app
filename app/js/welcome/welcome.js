
;~function () {

    var app = function () {
        this.width = api.winWidth;                              // 窗口宽度 用户设置广告下方cover
        this.type = api.pageParam.type;                         // 内容类型 true ? 引导页 : 广告页
        this.time = 4;                                          // 广告存在时间 time + 1
        this.$url = 'ads/ads/begin';                            // 接口地址
        this.$welcome = $('[data-selector="welcome"]');
        this.$advertising = $('[data-selector="advertising"]');
        this.$btn = $('[data-selector="btn"]');
        this.$cover = $('[data-selector="cover"]');
        this.$bg = $('[data-selector="bg"]');
    };
    /**
     * todo : 页面开始事件
     * desc : 监听安卓'keyback' 防止返回键取消广告 ， 判断页面类型进入不同的逻辑
     */
    app.prototype.init = function () {
        var self = this;
        self._event();
        if(self.type) return self._welcome_page();
        self._advertising_page();
    };
    /**
     * todo : 监听事件
     * desc : 监听关闭窗口事件 ，取消返回键默认设置
     * @private
     */
    app.prototype._event = function () {
        var self = this;
        // 监听keyback 禁止点击取消按钮退出广告
        api.addEventListener({
            name: 'keyback'
        }, function(ret, err) {});
        // 监听关闭广告按钮
        self.$btn.on('click' , function () {
            self._close();
            if(self.type) return localStorage.welcome = '1';
        });

    };
    /**
     * todo : 引导页逻辑函数
     * desc : 显示引导页 ， 开启滑动 ， 延时取消启动页
     * @private
     */
    app.prototype._welcome_page = function () {
        var self = this;
        self.$welcome.addClass('show');
        self._swipe();
        setTimeout(function(){$.app.removeLaunch();},250);
    };
    /**
     * todo : 广告页逻辑函数
     * desc : 求情广告内容 ， 加载广告图片 ， 显示广告页 ， 延时取消启动页面
     * @private
     */
    app.prototype._advertising_page = function () {
        var self = this;
        // 重设cover高度 ， 以达到无痕的效果
        self.$cover.height( self.width * 265 / 1080 );
        async.waterfall([
            function (cb) {
                self.ajax(cb);
            },
            function (ret,cb) {
                self._img_load( ret , cb );
            }
        ],function (err,ret) {
            self.$advertising.addClass('show');
            self._time_loop();
            setTimeout(function(){$.app.removeLaunch();},250);
        });
    };
    /**
     * todo : 广告存在事件倒计时
     * desc :
     * @private
     */
    app.prototype._time_loop = function () {
        var self = this;
        if(self.time <=0 ) return self._close();
        self.time -= 1;
        self.$btn.text(self.time);
        setTimeout(function () {
            self._time_loop();
        },1000);
    };
    /**
     * todo : 启动页滑动
     * @returns {Swipe}
     */
    app.prototype._swipe = function () {
        var banner  = new Swipe( $('.js-slider')[0] , {
            startSlide: 0,
            speed: 250,
            auto: 0,
            continuous: false,
            disableScroll: true,
            stopPropagation: true,
        });
        return banner;
    };
    /**
     * todo : 关闭当前的欢迎页面 ，取消应用全屏
     * @private
     */
    app.prototype._close = function () {
        // 关闭当前的欢迎页面
        api.closeWin({
            animation : {
                type : 'fade',
                subType : 'from_right',
                duration : 500
            }
        });
        // 取消应用全屏
        api.setFullScreen({
            fullScreen: false
        });
        // 修改状态栏样式 ， 后期可根据事件来变暗色
        api.setStatusBarStyle({
            style: 'light'
        });
        // 发送关闭页面事件
        $.api.sendEvent('removeLaunch',{});
    };
    /**
     * todo : 加载广告图片
     * desc : 如果无图片或者加载失败 ， 显示默认内置广告
     * @param argument  ajax请求获得的数据
     * @param callback
     */
    app.prototype._img_load = function (argument , callback) {
        var self = this,
            callback = $.callback( callback );
        var img = new Image();
        if(typeof argument['thumb'] == typeof void 0) return callback();
        img.src = argument['thumb'];
        img.onload  = function () {
            self.$bg.css('background-image' , 'url("' + img.src + '")' );
            callback();
        };
        img.onerror = function () {
            callback();
        };
    };
    /**
     * todo : 请求广告数据
     * @param callback
     */
    app.prototype.ajax = function (callback) {
        var self = this,
            callback = $.callback( callback );
        $.ajax({
            url : self.$url
        }).then( callback );
    };

    return $.welcome = function () {
        return new app();
    };
}();