;~function () {

    var app = function () {
        this.$data = api.pageParam;
        this.adsHtml = '';

        this.$htmlContent = $('[data-selector="html-content"]');
    };
    /**
     * todo : 广告接口地址
     * @type {string}
     */
    app.__proto__.$ads_url = '';

    app.prototype.init = function () {
        var self = this;
        self._main();
    };
    /**
     * todo : main 函数
     * @private
     */
    app.prototype._main = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self._ads( cb );                // 广告
            },
            function (cb) {
                self._one( cb );                // 根据$data 设置html
            }
        ],function (err,ret) {
            $.echo();
        })
    };
    /**
     * todo :  根据$data 设置html
     * @private
     */
    app.prototype._one = function ( callback ) {
        var self = this;
        callback = $.callback( callback );
        self.$htmlContent.html( self._html() );
        callback();
    };
    app.prototype._html = function () {
        var self = this,
            html = '';
        html += self._goods_html();
        html += self._item_html();
        return html;
    };
    /**
     * todo : 王牌项目html
     * @returns {string}
     * @private
     */
    app.prototype._item_html = function () {
        var self = this,
            html = '';
        if( typeof self.$data['item'] != 'object' || !self.$data['item'] || !self.$data['item'].length ) return html;
        html += '<div class="exhibit">';
        html += self.adsHtml ;
        html += '<div class="exhibit-group">';
        self.$data['item'].forEach(function (item) {
            if(!item['thumb']) return false;
            html += '<div class="exhibit-item"><div class="img" data-echo-background="';
            html += item['thumb'];
            html += '"></div></div>';
        });
        html += '</div>';
        html += '<div class="exhibit-title"><p>店内最受女性欢迎的镇店王牌项目！</p><p class="more icon-gt">更多</p></div>';
        html += '</div>';
        return html;
    };
    /**
     * todo : 王牌项目html
     * @returns {string}
     * @private
     */
    app.prototype._goods_html = function () {
        var self = this,
            html = '';
        if( typeof self.$data['goods'] != 'object' || !self.$data['goods'] || !self.$data['goods'].length ) return html;
        html += '<div class="exhibit">';
        html += '<div class="ads" data-event="openNewWin" data-params=\'{"name":"win_cargo_goods","param":{"id":"';
        html += self.$data['goods'][0]['id'];
        html += '","shop_id":"';
        html += self.$data['id'];
        html += '"}}\' data-selector="shop-ads" data-echo-background="';
        html += self.$data['goods'][0]['thumb'];
        html += '"><div class="hot shop"></div></div>';
        html += '<div class="exhibit-group">';
        self.$data['goods'].forEach(function (goods , i) {
            if( i ==  0 ) return false;
            if( !goods['thumb'] ) return false;
            html += '<div class="exhibit-item" data-event="openNewWin" data-params=\'{"name":"win_cargo_goods","param":{"id":"';
            html += goods['id'];
            html += '","shop_id":"';
            html += self.$data['id'];
            html += '"}}\'><div class="img" data-echo-background="';
            html += goods['thumb'];
            html += '"></div></div>';
        });
        html += '</div>';
        html += '<div class="exhibit-title"><p>2016年最受欢迎项目，即抢即划算 ！</p><p class="more icon-gt">更多</p></div>';
        html += '</div>';
        return html;
    };
    /**
     * todo : 平台广告函数
     * @param callback
     * @private
     */
    app.prototype._ads = function (callback) {
        var self = this;
        callback = $.callback( callback );
        async.waterfall([
            function (cb) {
                self._ajax_ads(cb);
            },
            function (ret , cb) {
                self._set_ads_html(ret , cb);
            }
        ],function (err,ret) {
            return callback();
        })
    };
    /**
     * todo : 请求广告数据
     * @param callback
     * @returns {*}
     * @private
     */
    app.prototype._ajax_ads = function (callback) {
        var self = this;
        callback = $.callback( callback );
        return callback(null, {});
        /*$.ajax({
            url : app.$ads_url,
            data : {

            }
        }).then( callback );*/
    };
    /**
     * todo : 设置并返回广告html
     * @param ret
     * @param callback
     * @private
     */
    app.prototype._set_ads_html = function (ret , callback) {
        var self = this,
            html = '';
        html += '<div class="ads" data-echo-background="';
        html += '../../images/shopInfo-index-banner1.jpg';
        html += '"><div class="hot meileba"></div></div>';
        self.adsHtml = html;
        callback();
    };
    return $.storeIndex = function () {
        return new app();
    };
}();