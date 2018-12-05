/**
 * 积分商城首页入口
 */
;~function () {
    var app = function () {
        this.userLocation = JSON.parse( localStorage['userLocation'] );
        this.advBanner = $('[data-selector="adv-banner"]');
        this.listsGroup = $('[data-selector="lists-group"]');
        this.$loadMore = $('._load-more');
        this.page = 1;
        this.size = 10;
        this.pullRefresh = $.pullRefresh();
        this.scroll = $.scroll();
        this.TOAST = $.toast();
    };
    app.prototype.init = function () {
        this._main();
        this._refresh();
    };
    app.prototype._refresh = function () {
        var self = this;
        self.pullRefresh.set(function () {
            self._main();
        });
    };
    /**
     * todo : 主线进程
     * desc : 获得积分商城列表
     */
    app.prototype._main = function () {
        var self = this;
        self.get_coin_adv();  //获取页面广告
        self.page = 1;        //重置page
        self._one();
    };
    app.prototype._one = function () {
        var self = this;
        //取消监听滚动到底部
        self.scroll.removeListenerToBottom();
        // 取消下拉
        self.pullRefresh.close();
        async.waterfall([
            function (callback) {
                $.ajax({
                    url : 'mall/point/list',
                    data : {
                        page : self.page ,
                        size : self.size
                    },
                    cache : false,
                }).then( callback )
            },
            function ( ret , cb ) {
                self.appendHtml(ret , cb);
            },
            function (ret , cb) {
                self.iScroll( ret , cb);
            }
        ],function ( err ) {
            //错误操作
            $.echo();
            self._end();
            if(err) return $.api.toast(err);
            //提升页码
            self.page += 1;
        });
    };
    /**
     * todo : 获取积分商城广告并显示
     * desc : 获取积分商城广告并显示
     * tips : 支线程序，报错讲不影响主线的使用
     */
    app.prototype.get_coin_adv = function () {
        var self = this;
        async.waterfall([
            function ( cb ) {
                // 获取广告，暂时先用首页广告
                $.ajax({
                    url : 'ads/ads/list' ,
                    data : {
                        city_id : self.userLocation['city']['id'],
                        position : 1 ,
                        size : 5
                    }
                }).then( cb );
            },
            function ( ret , cb ) {
                // 填写广告到html至页面
                self.advHtml(ret , cb)
            }
        ],function (err , ret) {
            if(err) return false;
            self.swipe();
        });
    };

    /**
     * todo : 添加广告内容
     * desc : 添加广告html
     * @param ret 从接口获得的数据
     * @param callback 执行完成后的回调函数
     */
    app.prototype.advHtml = function (ret , callback) {
        callback = typeof callback == 'function' ? callback : function () {};
        var db = ret['info'],
            html = '',
            self = this;
        html += '<div class="banner-wrap js-slider swipe"><div class="banner-group swipe-wrap">';
        db.forEach(function (item) {
            if(!item || typeof item == typeof void 0) return false;
            html += '<div class="banner-item" style="background-image: url(\'';
            html += item.thumb;
            html += '\')"></div>';
        });
        html += '</div></div>';
        self.advBanner.html(html);
        callback();
    };
    /**
     * todo : 积分商城轮播图初始化
     * desc : 启动轮播
     * @param callback 启动成功的回调函数
     * @returns {*}
     */
    app.prototype.swipe = function () {
        var banner  = new Swipe( $('.js-slider')[0] , {
            startSlide: 0,
            speed: 400,
            auto: 3000,
            continuous: true,
            disableScroll: false,
            stopPropagation: false,
            compatWithPullToRefresh : true,
            frameName : api.frameName,
            callback: function(index,el) {

            }
        });
        return banner;
    };


    /**
     * 是否需要监听到底部
     * @param ret
     * @param callback
     * @returns {*}
     */
    app.prototype.iScroll = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        if( !ret['count'] || ret['count'] < self.size ) {
            self.$loadMore.text('后面没有了')
            return callback();
        };
        self.$loadMore.text('努力加载中');
        self.scroll.addListenerToBottom(function () {
            self._one();
        });
        callback();
    };
    /**
     * todo : return list item html
     * desc : html string or ''
     * @param ret
     * @returns {string}
     */
    app.prototype.listsHtml = function (ret) {
        var html = '',
            db = ( !!ret['info'] || typeof  ret['info'] === typeof void 0 ) ? ret['info'] :  [];
        db.forEach(function (item) {
            html += '<div class="lists-item hot" data-event="openNewWin" data-params=\'{"name":"win_cargo_coin","param":{"id":"';
            html += item['id'];
            html += '"}}\'><div class="lists-img"><img src="../images/shop-item.jpg" data-echo="';
            html += item['thumb'];
            html += '" /></div><div class="desc"><p>';
            html += item['title'];
            html += '</p><div class="pink"><i class="icon-score"></i><span>';
            html += item['offer_point'];
            html += '积分</span></div></div><div class="tips">热门</div></div>';
        });
        return html;
    };
    /**
     * todo : add lists html
     * desc : if page == 0 'html' or 'append
     * @param ret
     * @param callback
     */
    app.prototype.appendHtml = function ( ret , callback) {
        var self = this;
        self.listsGroup[ self.page == 1 ?  'html' : 'append' ]( self.listsHtml(ret) );
        callback(null,ret);
    };
    app.prototype._end = function () {
        var self = this;
        setTimeout(function () {
            self.TOAST.load().Progress();
        },500);
    };

    $.coinIndex = function () {
        return new app();
    };
}();