;~function () {

    var app = function () {
        this.id = api.pageParam.id;
        this.$shopAds = $('[data-selector="shop-ads"]');
        this.$item = $('[data-selector="item"]');
        this.$goods = $('[data-selector="goods"]');
    };

    app.prototype.init = function () {
        var self = this;
        self.ads();
        self.mian();
    };
    /**
     * todo : 主函数
     */
    app.prototype.mian = function () {
        var self = this;
        self._item();
        self._goods();
    };
    /**
     * todo 设置服务项目入口
     * @private
     */
    app.prototype._item = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self.append_item( api.pageParam.item , cb);
            }
        ],function (err) {
            if(!err) return $.echo();
            self.$item.remove();
            self.$item.next('[class*="-title"]').remove();
        })
    };
    /**
     * todo : 广告下的产品列表html
     * @param ret
     * @returns {string}
     */
    app.prototype.html = function (ret ) {
        var self = this,
            html = '';
        ret.forEach(function (item , i) {
            if(i > 1) return false;
            html += '<div class="exhibit-item" data-event="openNewWin" data-params=\'{"name":"win_beauty_details","param":{"id":"';
            html += item.id;
            html += '","shop_id":"';
            html += self.id;
            html += '"}}\'><div class="img" data-echo-background="';
            html += item.thumb;
            html += '"></div></div>';
        });
        return html;
    };
    /**
     * todo : 添加服务html
     * @param ret
     * @param callback
     * @returns {*}
     */
    app.prototype.append_item = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        if(typeof ret == typeof void 0 || !ret.length ) return callback('数据不存在');
        self.$item.html(self.html(ret));
        callback();
    };
    /**
     *
     * @private
     */
    app.prototype._goods = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self.append_goods( api.pageParam.goods , cb);
            }
        ],function (err,ret) {
            if(!err) return $.echo();
            self.$item.remove();
            self.$item.next('[class*="-title"]').remove();
        })
    };
    /**
     * todo : 添加商品html
     * @param ret
     * @param callback
     * @returns {*}
     */
    app.prototype.append_goods = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        if(typeof ret == typeof void 0 || !ret.length ) return callback('数据不存在');
        self.$goods.html(self.html(ret));
        callback();
    };
    /**
     * todo : 店铺首页的广告入口
     * desc : 支线程序
     */
    app.prototype.ads = function () {
        var self = this;
        // 店铺广告
        async.waterfall([
            function (cb) {
                self.ajax_shop_ads(cb)
            },
            function (ret , cb) {
                self.changeShopAds(ret , cb);
            }
        ],function (err,ret) {
            if(err) return self.$shopAds.remove();
            $.echo();
        });
        //平台广告    * 暂无接口
    };
    /**
     * todo : 请求店铺广告接口数据
     * desc : 广告系统，店铺广告
     * @param callback : function
     */
    app.prototype.ajax_shop_ads = function (callback) {
        var self = this;
        callback =  $.callback(callback);
        $.ajax({
            url : 'ads/index/shop',
            data : {
                id  : self.is
            }
        }).then(callback);
    };
    /**
     * todo : 修改广告系统
     * desc : 修改店铺广告，如果不存在广告，移除广告位
     * @param ret : object ajax获得的数据
     * @param callback : function 回调函数
     * @returns {*}
     */
    app.prototype.changeShopAds = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        if(typeof ret.data == typeof void 0 || typeof ret.data.info == typeof void 0 || !ret.data.info.length ) return callback('数据不存在');
        self.$shopAds.attr('data-echo-background' , ret.data.info[0].thumb );
        callback();
    };
    return $.beautyHomeIndex = function () {
        return new app();
    };
}();