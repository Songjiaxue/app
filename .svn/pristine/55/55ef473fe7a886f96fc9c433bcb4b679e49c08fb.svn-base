;~function () {

    var app = function () {
        this.id = api.pageParam.id;
        this.shop_id = api.pageParam.shop_id || typeof void 0;
        this.wrap = $('.main.index');
    };

    app.prototype.init = function () {
        var self = this;
        self.main()
    };
    /**
     * 主函数
     */
    app.prototype.main = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self.ajax(cb);
            },
            function (ret ,cb) {
                self.setHtml( ret , cb);
            }
        ],function (err,ret) {
            self.swipe();
        })
    };
    /**
     * 设置轮播图滚动
     */
    app.prototype.swipe = function () {
        $.app.swipe();
    };
    /**
     * todo : 设置所有的html
     * @param ret : object  商品数据
     * @param cb : function 回调函数
     */
    app.prototype.setHtml = function (ret , cb) {
        var self = this,
            html = '';
        html += self._swipeHtml(ret);
        html += self._titleHtml(ret);
        html += self._tagHtml(ret);
        html += self._inforHtml(ret);
        html += self._assessHtml(ret);
        html += self._footerHtml(ret);
        cb( null , self.wrap.append(html) );
    };
    /**
     * todo : 设置轮播图信息
     * desc : 如果有数据，则返回正确的html ， 没有数据则返回一个默认的图片
     * @param ret : object 商品数据
     * @returns {string} 返回的html
     * @private
     */
    app.prototype._swipeHtml = function (ret) {
        var html = '',
            db = ret.data;
        if(typeof db.thumb_url === typeof void 0 || !db.thumb_url.length) return '<div class="banner"><div class="banner-warp js-slider swipe"><div class="banner-group swipe-wrap"><div class="banner-item" style="background-image: url(\'../../images/info-banner.jpg\')"></div></div> </div> </div>';
        html += '<div class="banner"><div class="banner-warp js-slider swipe"><div class="banner-group swipe-wrap">';
        db.thumb_url.forEach(function (thumb) {
            html += '<div class="banner-item" style="background-image: url(\'';
            html += thumb.path || 0;
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
    app.prototype._titleHtml = function (ret) {
        var db = ret.data,
            html = '';
        html += '<div class="details-title"><div class="price fl">¥ ';
        html += db.offer_money || '';
        html += '</div><div class="price old fl">¥ ';
        html += db.original_price || '';
        html += '</div><div class="price over fl">已售';
        html += db.sales || 0;
        html += '件</div></div>';
        html += '<div class="cargo-title">';
        html += db.title || '';
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
    app.prototype._tagHtml = function (ret) {
        var db = ret.data,
            html = '';
        html += '<div class="ui-tool-wrap"><div class="ui-tool"><div class="ui-tool-in clamp">美乐吧承诺：一旦发现商家宰客、欺客，经查明属实，将直接返现金2000元</div></div></div>';
        if(!db.is_new && !db.is_hot) return html;
        html += '<div class="ui-tool-wrap"><div class="ui-tool icon-gt border"><div class="ui-tool-in">';
        html += '<div class="ui-tool-group">';
        html += !!db.is_new ? '<div class="ui-tool-item"><div class="ui-tool-icon">新</div><div class="ui-tool-desc">新品推荐 </div></div>' : '';
        html += !!db.is_hot ? '<div class="ui-tool-item"><div class="ui-tool-icon">热</div><div class="ui-tool-desc">热卖产品</div></div>' : '';
        html += '</div></div></div></div>';
        return html;
    };
    /**
     * todo : 商品详细信息，html设置
     * @param ret : object 商品数据
     * @returns {string}
     * @private
     */
    app.prototype._inforHtml = function (ret) {
        var db = ret.data,
            html = '';
        if(typeof db.content == typeof void 0) return html;
        html += '<div class="ui-tool-wrap"><div class="ui-tool icon-gt border"><div class="ui-tool-in"><div class="ui-tool-group">';
        html += '<div class="ui-tool-item"><div class="ui-tool-desc">详情</div></div></div></div></div>';
        html += '<div class="ui-tool-infor"><div class="ui-tool-infor-in">';
        html += db.content || '';
        html += '</div></div></div>';
        return html;
    };
    app.prototype._assessHtml = function (ret) {
        var db = ret.data,
            html = '';
        if( db.comment == typeof void 0 ) return html;
        html += '<div class="ui-tool-wrap" data-event="openNewWin" data-params=\'{"name":"win_coin_assess","param":{"id":"';
        html += db.id;
        html += '"}}\'><div class="ui-tool icon-gt border"><div class="ui-tool-in"><div class="ui-tool-group">';
        html += '<div class="ui-tool-item"><div class="ui-tool-desc">宝贝评价（';
        html += db.comment.length || 0;
        html += '）</div></div></div></div></div>';
        if( !db.comment.length ) return html += '</div>';
        html += '<div class="main assess"><div class="lists"><div class="lists-group">';
        db.comment.forEach(function (assess) {
            html += '<div class="lists-item"><div class="title"><div class="head" data-echo-background="';
            html += assess.avatar;
            html += '"></div><div class="nickname">';
            html += assess.nick || '佚名';
            //html += '<span>V1</span>';
            html += '</div></div><div class="desc">';
            html += assess.content;
            html += '</div>';
            //html += '<div class="img"><div class="img-item"></div><div class="img-item"></div></div>';
            html += '<div class="end">';
            html += assess.ago;
            html += '</div></div>';
        });
        html += '</div></div></div>';
        html += '</div>';
        return html;
    };
    app.prototype._footerHtml = function (ret) {
        var self = this,
            db = ret.data,
            html = '';
        html += '<div class="footer"><div class="footer-group"><div class="footer-item" data-event="';
        html += self.shop_id !== db.shop_id ? 'closeWin' : 'openNewWin';
        html += '" data-params=\'{"name":"win_beauty_home","param":{"id","';
        html += db.shop_id;
        html += '"}}\'><div class="icon icon-cargo-home"></div><p>店铺</p></div>';
        html += '<div class="footer-item"><div class="icon icon-cargo-share"></div><p>分享</p></div>';
        html += '<div class="footer-item" data-event="call" data-params=\'{"tel","+8613082807225"}\'><div class="icon icon-coin-tel"></div><p>联系</p></div>';
        html += '<div class="footer-item" data-event="openNewWin" data-params=\'{"name":"';
        html += db.type == 1 ? 'win_beauty_create_order' : db.type == 3 ? 'win_item_create_order' : 'win_coin_create_order';
        html += '","param":{"id":"';
        html += db.id;
        html += '","shop_id":"';
        html += db.shop_id;
        html += '"}}\'>立即购买</div></div></div>';
        return html;
    };
    /**
     * todo : 请求商品数据
     * @param callback : function 请求完成后的回调函数
     */
    app.prototype.ajax = function (callback) {
        var self = this;
        callback = $.callback(callback);
        $.ajax({
            url : 'mall/goods/detail',
            data : {
                goods_id : self.id
            },
            cache : false
        }).then(callback);
    };
    return $.beautyDetails = function () {
        return new app();
    };
}();