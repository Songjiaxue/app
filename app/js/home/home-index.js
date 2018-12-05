;~function () {

    var app = function () {
        this.userLocation = api.pageParam;
        this.$cityName = $('[data-selector="city-name"]');
        this.advertisingData = {
            banner : '',
            brands : '',
            bill : ''
        };   //广告数据

        this.$banner = $('[data-selector="banner"]');
        this.$brands = $('[data-selector="brands"]');
        this.$bill = $('[data-selector="bill"]');
        this.$storeLists = $('[data-selector="store-lists"]');
        this.$moreStore = $('[data-selector="more-store"]');

        this.$STORELISTS = $.storeLists();
        this.$SCROLL = $.scroll();
        this.$BMAP = $.bMap();
    };
    app.prototype.init = function () {
        var self = this;
        self._listener_remove_launch();
        self.main();
    };
    app.prototype.main = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                // 设置地区信息
                self._set_city_name(self.userLocation , cb);
            },
            function (cb) {
                // 广告系统 轮播图广告和品牌推荐
                self._advertising(cb);
            }/*,
            function (cb) {
                // 店铺列表
                self._store_lists(cb);
            }*/
        ],function (err,ret) {
            self.ajax();
        });
    };
    /**
     * todo : 添加店铺列表
     * desc : 1. 移除滚动监听
     *        2. 获取数据
     *        3. 添加html
     *        4. 判断是否 ， 是否取消/添加滚动监听
     * @param callback
     * @private
     */
    app.prototype._store_lists = function (callback) {
        var self = this;
        callback = $.callback(callback);
        self.$SCROLL.removeListenerToBottom();
        async.waterfall([
            function (cb) {
                self.$STORELISTS.ajax(cb)
            },
            function (ret , cb) {
                self._append_store_lists_html(ret , cb);
            },
            function (ret , cb) {
                self.$STORELISTS._store_lists_end(ret ,cb);
            }
        ],function (err,ret) {
            callback();
            if(err) return false;
            self.$SCROLL.addListenerToBottom(function () {
                self._store_lists();
            });
        });
    };
    app.prototype._append_store_lists_html = function (argument , callback) {
        var self = this,
            callback = $.callback(callback),
            fn = 'html',
            html = self.$STORELISTS['_store_lists_html']( argument );
        if( self.$STORELISTS.page != 1) fn = 'append';
        self.$STORELISTS.$storeLists[fn]( html );
        callback(null,argument);
    };
    /**
     * todo : 广告位置
     * desc :  1. 获取缓存中的广告数据，不存在则使用ajax请求获得数据 ， ajax请求的数据讲缓存到本地 home-index-advertising
     *         2. 填充页面内容，如果不存在，直接删除当前不存在的内容
     * @private
     */
    app.prototype._advertising = function (callback) {
        var self = this,
            callback = $.callback(callback);
        async.waterfall([
            function (cb) {
                self._get_advertising_data(cb);
            },
            function (ret , cb) {
                self._set_advertising_html(ret , cb);
            }
        ],function (err,ret) {
            self.swipe();
            callback();
        });
    };
    /**
     * todo : 从缓存中获取数据
     * desc : 不存在进行ajax请求 ， 终止_advertising函数进程
     * @param callback
     * @private
     */
    app.prototype._get_advertising_data = function (callback) {
        var self = this,
            callback = $.callback( callback ),
            cache = localStorage['home-index-advertising'];
        if(typeof cache !== typeof void 0) return callback(null, JSON.parse( cache ));
        self.ajax();
    };
    /**
     * todo : 设置广告内容html
     * @param argument
     * @param callback
     * @private
     */
    app.prototype._set_advertising_html = function (argument,callback) {
        var self = this,
            callback = $.callback( callback );
        self._banner_html(argument.banner);
        self._brands_html(argument.brands);
        self._bill_html(argument.bill);
        callback();
    };
    /**
     * todo : 主页轮播的广告
     * @param argument
     * @returns {*}
     * @private
     */
    app.prototype._banner_html = function (argument) {
        var self = this,
            html = '';
        if(!argument) return self.$banner.remove();
        html += '<div class="banner-warp js-slider swipe"><div class="banner-group swipe-wrap">';
        argument.info.forEach(function (banner) {
            html += '<div class="banner-item" style="background-image: url(\'';
            html += banner['thumb'];
            html += '\')"></div>';
        });
        html += '</div></div>';
        self.$banner.html(html);
    };
    /**
     * todo : 品牌推荐的三个广告
     * @param argument
     * @returns {*}
     * @private
     */
    app.prototype._brands_html = function (argument) {
        var self = this,
            html = '';
        if(!argument) return self.$brands.remove();
        html += '<div class="title"> —  品牌推荐  —</div><div class="brands"><div class="brands-in"><div class="brands-warp"><div class="brands-group">';
        argument['info'].forEach(function (brands) {
            html += '<div class="brands-item" style="background-image: url(\'';
            html += brands['thumb'];
            html += '\')"></div>';
        });
        html += '</div></div></div></div>';
        self.$brands.html(html);
    };
    /**
     * todo : 品质同城两个广告
     * @param argument
     * @returns {*}
     * @private
     */
    app.prototype._bill_html = function (argument) {
        var self = this,
            html = '';
        if(!argument) return self.$bill.remove();
        html += '<div class="bill"><div class="bill-in"><div class="bill-warp"><div class="bill-group">';
        argument['info'].forEach(function (bill) {
            html += '<div class="bill-item"><div class="bill-title">';
            html += bill.name || '';
            html += '</div><div class="bill-context" style="background-image: url(\'';
            html += bill['thumb'];
            html += '\')"></div></div>';
        });
        html += '</div></div></div></div>';
        self.$bill.html(html);
    };
    /**
     * todo : 请求广告接口 , 将数据缓存到本地
     * 重启_advertising 函数
     * @param callback
     */
    app.prototype.ajax = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self.ajax_banner(cb);
            },
            function (cb) {
                self.ajax_brands(cb)
            },
            function (cb) {
                self.ajax_bill(cb);
            }
        ],function (err,ret) {
            localStorage['home-index-advertising'] = JSON.stringify(self.advertisingData);
            self._advertising();
        });
    };
    /**
     * todo : 首页轮播图广告数据获取
     * desc : 获取位置1广告5个
     * @param callback
     */
    app.prototype.ajax_banner = function (callback) {
        var self = this,
            callback = $.callback( callback );
        $.ajax({
            url : 'ads/ads/list',
            data : {
                position : 1,
                size : 5 ,
                city_id : self.userLocation.city.id
            }
        }).then(function (err,ret) {
            if(err) return callback();
            self.advertisingData.banner = ret;
            callback();
        });
    };
    /**
     * todo : 首页品牌推荐位置广告数据获取
     * desc : 位置2 数量3
     * @param callback
     */
    app.prototype.ajax_brands = function (callback) {
        var self = this,
            callback = $.callback( callback );
        $.ajax({
            url : 'ads/ads/list',
            data : {
                position : 2,
                size : 3,
                city_id : self.userLocation.city.id
            }
        }).then(function (err,ret) {
            if(err) return callback();
            self.advertisingData.brands = ret;
            callback();
        });
    };
    /**
     * todo : 获取品质同城的广告
     * desc : 位置3 数量2
     * @param callback
     */
    app.prototype.ajax_bill = function (callback) {
        var self = this,
            callback = $.callback( callback );
        $.ajax({
            url : 'ads/ads/list',
            data : {
                position : 3,
                size : 2,
                city_id : self.userLocation.city.id
            }
        }).then(function (err,ret) {
            if(err) return callback();
            self.advertisingData.bill = ret;
            callback();
        });
    };
    /**
     * todo : 设置首页显示的地区名称
     * @param argument
     * @param callback
     * @private
     */
    app.prototype._set_city_name = function (argument , callback) {
        var self = this,
            callback = $.callback( callback );
        self.$cityName.text( self.userLocation.city.city );
        callback();
    };
    app.prototype.swipe = function () {
        new Swipe( $('.js-slider')[0] , {
            startSlide: 0,
            speed: 400,
            auto: 3000,
            continuous: true,
            disableScroll: false,
            stopPropagation: false,
        });
    };
    /**
     * 监听广告以及欢迎页面关闭
     * @private
     */
    app.prototype._listener_remove_launch = function () {
        var self = this;
        $.api.listenerEvent('removeLaunch' , function () {
            setTimeout(function () {
                self._get_user_location()
            },1000);
        });
    };
    /**
     * todo : 请求用户当前详情位置
     * desc : 1. 根据ip 获得用户city and zone
     *        2. 根据map 获得精准gps位置，如果用户拒绝
     *        3. 写入缓存
     * @private
     */
    app.prototype._get_user_location = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self.$BMAP._get_user_location(cb);
            },
            function (ret , cb) {
                self.userLocation = $.extend({} , self.userLocation , ret);
                cb();
            },
            function (cb) {
                $.ajax({
                    url : 'common/location/ip'
                }).then(cb);
            },
            function ( ret , cb ) {
                self.userLocation = $.extend({} , self.userLocation , ret);
                cb();
            }
        ],function (err,ret) {
            if(err) $.api.toast(err);
            localStorage['userLocation'] = JSON.stringify( self.userLocation );
            self.$STORELISTS = $.storeLists();
            self.$moreStore.css({
                'height' : '0px'
            });
            self._store_lists();
        });

    };
    return $.homeIndex = function () {
        return new app();
    };
}();