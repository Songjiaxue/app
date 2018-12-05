;~function () {

    var app = function () {
        this.page = 1;
        this.size = 10;
        this.type = 2;
        this.$wrap = $('[data-selector="itemWrap"]');
        this.scroll = $.scroll();
        this.$loadMore = $('._load-more');
    };
    app.prototype.init = function () {
        this._main();
    };

    app.prototype._main = function () {
        var self = this;
        self.page = 1;
        self._one();
    };
    app.prototype._one = function () {
        var self = this;
        self.scroll.removeListenerToBottom();
        async.waterfall([
            function (cb) {
                self._ajax( cb );
            },
            function (ret ,cb) {
                self._append( ret , cb );
            },
            function (ret , cb) {
                self._iScroll(ret,cb);
            }
        ],function (err) {
            $.echo();
            if(err) return $.api.toast(err);
            self.page += 1;
        });
    };
    app.prototype._html = function ( ret ) {
        var html = '',
            sum = 0;
        ret = !ret['count'] || [];
        ret.forEach(function (order) {
            html += '<div class="list-item" data-selector="';
            html += order.id;
            html += '"><div class="list-item-top"><div class="top-left" data-echo-background="';
            html += order.logo;
            html += '"></div><div class="top-right">';
            html += order.name;
            html += '</div></div>';
            order.content.forEach(function (content) {
                html += '<div class="list-item-center"><div class="center-item center-img" data-echo-background="';
                html += content.goods_logo;
                html += '"></div><div class="center-item center-text"><div class="center-text-top"><div class="text-top-item">';
                html += content.goods_title;
                html += '</div><div class="text-top-item text-top-right">共';
                html += content.goods_sum || 0;
                sum += parseInt(content.goods_sum) || 0;
                html += '件</div></div><div class="center-text-center">购买套餐 ：默认</div><div class="center-text-bottom">积分兑换</div></div></div>';
            });
            html += '<div class="all"><div class="all-in">共';
            html += sum;
            html += '件商品（共支付';
            html += order.offer_point;
            html += '积分）</div></div>';
            html += '<div class="list-item-bottom"><div class="btn-group"><div class="btn-item" data-event="deleteOrder" data-params=\'{"id":"';
            html += order.id;
            html += '"}\'>删除订单</div><div class="btn-item" data-event="openNewWin" data-params=\'{"name":"win_coin_chase","param":{"id":"';
            html += order.id;
            html += '"}}\'>查看物流</div>';
            html += '</div></div></div>';
        });
        return html;
    };
    app.prototype._append = function ( ret  , callback) {
        var self = this;
        self.$wrap[self.page == 1 ? 'html' : 'append']( self._html(ret) );
        callback( null , ret );
    };
    app.prototype._iScroll = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        if( !ret['count'] || ret['count'] < self.size ) {
            self.$loadMore.text('到底啦');
            return callback();
        };
        self.$loadMore.text('努力加载中');
        self.scroll.addListenerToBottom(function () {
            self._one();
        });
        callback();
    };
    app.prototype.delete = function (ret) {
        var id = ret.id;
    };
    app.prototype._ajax = function (callback) {
        callback = $.callback( callback );
        var self = this;
        $.ajax({
            url : 'member/order/list',
            data : {
                page : self.page,
                size : self.size
            }
        }).then(callback);
    };
    return $.coinOrderItem = function () {
        return new app();
    };
}();