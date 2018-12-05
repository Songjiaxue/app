;~function () {

    var app = function () {
        this.$data = api.pageParam;
        this.$url = 'mall/goods/detail';
        this.$html = $('[data-selector="html-content"]');
        this.$tools = $('[data-selector="tools"]');
    };

    app.prototype.init = function () {
        var self = this;
        self._main()
    };
    /**
     * 主函数
     */
    app.prototype._main = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self._ajax(cb);
            },
            function (ret ,cb) {
                self._append_html( ret , cb);
            }
        ],function (err,ret) {
            self._swipe();
            self._event();
        })
    };
    app.prototype._event = function () {
        var self = this,
            $w = $(window);
        $w.on('scroll' , function () {
            var  t = $w.scrollTop(),
                o = ( 0.75 - t / 200 );
            self.$tools.css('opacity' ,  o);
        });
    };
    /**
     * 设置轮播图滚动
     */
    app.prototype._swipe = function () {
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
     * todo : 设置所有的html
     * @param ret : object  商品数据
     * @param cb : function 回调函数
     */
    app.prototype._append_html = function (ret , cb) {
        var self = this,
            html = '';
        html += self._swipe_html(ret);
        html += self._title_html(ret);
        html += self._tag_html(ret);
        html += self._info_html(ret);
        html += self._assess_html(ret);
        html += self._footer_html(ret);
        cb( null , self.$html.append(html) );
    };
    /**
     * todo : 设置轮播图信息
     * desc : 如果有数据，则返回正确的html ， 没有数据则返回一个默认的图片
     * @param ret : object 商品数据
     * @returns {string} 返回的html
     * @private
     */
    app.prototype._swipe_html = function (ret) {
        var html = '';
        if(typeof ret['thumb_url'] === typeof void 0 || !ret['thumb_url'].length) return '<div class="banner"><div class="banner-warp js-slider swipe"><div class="banner-group swipe-wrap"><div class="banner-item" style="background-image: url(\'../../images/info-banner.jpg\')"></div></div> </div> </div>';
        html += '<div class="banner"><div class="banner-warp js-slider swipe"><div class="banner-group swipe-wrap">';
        ret['thumb_url'].forEach(function (thumb) {
            html += '<div class="banner-item" style="background-image: url(\'';
            html += thumb['path'] || '';
            html += '\')"></div>';
        });
        html += '</div></div></div>';
        return html;
    };
    /**
     * todo : 商品价格标题等信息
     * @param ret : object 商品数据
     * @returns {string} 返回html
     * @private
     */
    app.prototype._title_html = function (ret) {
        var html = '';
        html += '<div class="details-title"><div class="price fl">¥ ';
        html += ret['offer_money'] || '100000';
        html += '</div><div class="price old fl">¥ ';
        html += ret['original_price'] || '10000';
        html += '</div><div class="price over fl">已售';
        html += ret['sales'] || 0;
        html += '件</div></div>';
        html += '<div class="cargo-title">';
        html += ret['title'] || '';
        html += '</div>';
        return html;
    };
    /**
     * todo : 设置标签内容
     * desc : 包含 美乐吧承诺，是否为新品，是否为热卖
     * @param ret
     * @returns {*}
     * @private
     */
    app.prototype._tag_html = function (ret) {
        var html = '';
        html += '<div class="ui-tool-wrap"><div class="ui-tool"><div class="ui-tool-in clamp">美乐吧承诺：一旦发现商家宰客、欺客，经查明属实，将直接返现金2000元</div></div></div>';
        if(!ret['is_new'] && !ret['is_hot']) return html;
        html += '<div class="ui-tool-wrap"><div class="ui-tool icon-gt border"><div class="ui-tool-in">';
        html += '<div class="ui-tool-group">';
        html += !!ret['is_new'] ? '<div class="ui-tool-item"><div class="ui-tool-icon">新</div><div class="ui-tool-desc">新品推荐 </div></div>' : '';
        html += !!ret['is_hot'] ? '<div class="ui-tool-item"><div class="ui-tool-icon">热</div><div class="ui-tool-desc">热卖产品</div></div>' : '';
        html += '</div></div></div></div>';
        return html;
    };
    /**
     * todo : 商品详细信息，html设置
     * @param ret : object 商品数据
     * @returns {string}
     * @private
     */
    app.prototype._info_html = function (ret) {
        var html = '';
        if(typeof ret['content'] == typeof void 0) return html;
        html += '<div class="ui-tool-wrap"><div class="ui-tool border icon-gt"><div class="ui-tool-in"><div class="ui-tool-group"><div class="ui-tool-item"><div class="ui-tool-desc">';
        html += '详情';
        html += '</div></div></div></div></div><div class="ui-tool-infor"><div class="ui-tool-infor">';
        html += ret['content'];
        html += '</div></div></div>';
        return html;
    };
    app.prototype._assess_html = function (ret) {
        var html = '';
        if( ret['comment'] == typeof void 0 || !ret['comment'].length ) return html;
        html += '<div class="ui-tool-wrap" data-event="openNewWin" data-params=\'{"name":"win_assess","param":{"id":"';
        html += ret['id'];
        html += '"}}\'><div class="ui-tool icon-gt border"><div class="ui-tool-in"><div class="ui-tool-group">';
        html += '<div class="ui-tool-item"><div class="ui-tool-desc">宝贝评价（';
        html += ret['comment'].length || 0;
        html += '）</div></div></div></div></div>';
        if( !ret['comment'].length ) return html += '</div>';
        html += '<div class="main assess"><div class="lists"><div class="lists-group">';
        ret['comment'].forEach(function (assess) {
            html += '<div class="lists-item"><div class="title"><div class="head" data-echo-background="';
            html += assess['avatar'];
            html += '"></div><div class="nickname">';
            html += assess['nick'] || '佚名';
            //html += '<span>V1</span>';
            html += '</div></div><div class="desc">';
            html += assess['content'];
            html += '</div>';
            //html += '<div class="img"><div class="img-item"></div><div class="img-item"></div></div>';
            html += '<div class="end">';
            html += assess['ago'];
            html += '</div></div>';
        });
        html += '</div></div></div>';
        html += '</div>';
        return html;
    };
    app.prototype._footer_html = function (ret) {
        var self = this,
            html = '';
        html += '<div class="footer"><div class="footer-group"><div class="footer-item" data-event="';
        html += self.$data['shop_id'] !== ret['shop_id'] ? 'closeWin' : 'openNewWin';
        html += '" data-params=\'{"name":"win_beauty_home","param":{"id","';
        html += ret['shop_id']
        html += '"}}\'><div class="icon icon-cargo-home"></div><p>店铺</p></div>';
        html += '<div class="footer-item"><div class="icon icon-cargo-share"></div><p>分享</p></div>';
        html += '<div class="footer-item" data-event="call" data-params=\'{"tel","+8613082807225"}\'><div class="icon icon-coin-tel"></div><p>联系</p></div>';
        html += '<div class="footer-item" data-event="openNewWin" data-params=\'{"name":"win_goods_order","param":{"id":"';
        html += ret['id'];
        html += '","shop_id":"';
        html += ret['shop_id'];
        html += '"}}\'>立即购买</div></div></div>';
        return html;
    };
    /**
     * todo : 请求商品数据
     * @param callback : function 请求完成后的回调函数
     */
    app.prototype._ajax = function (callback) {
        var self = this;
        callback = $.callback(callback);
        $.ajax({
            url : self.$url,
            data : {
                goods_id : self.$data['id']
            },
            cache : false
        }).then(callback);
    };

    return $.cargoGoods = function () {
        return new app();
    };
}();