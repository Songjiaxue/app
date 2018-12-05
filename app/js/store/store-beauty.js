;~function () {

    var app = function () {
        this.$url = 'mall/shop/goods';
        this.$data = api.pageParam;
        this.pullRefresh = $.pullRefresh();
        this.SCROLL = $.scroll();
        this.page = 1;
        this.size = 10;
        this.$html = $('[data-selector="html-content"]');
        this.$loadMore = $('._load-more');
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
    app.prototype._main = function () {
        var self = this;
        self.page = 1;
        self._one();
    };
    app.prototype._one = function () {
        var self = this;
        //
        self.SCROLL.removeListenerToBottom();

        self.pullRefresh.close();
        
        async.waterfall([
            function (cb) {
                self._ajax(cb);
            },
            function (ret , cb) {
                self._append_html( ret , cb );
            },
            function (ret , cb) {
                self._iScroll(ret , cb);
            }
        ],function (err,ret) {
            //错误操作
            $.echo();
            if(err) return $.api.toast(err);
            //提升页码
            self.page += 1;
        })
    };
    app.prototype._append_html = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        self.$html[ self.page <= 1 ? 'html' : 'append' ]( self._html(ret) );
        callback(null , ret);
    };
    app.prototype._html = function (ret) {
        var self = this,
            html = '';
        ret = !!ret['info'] ? ret['info'] : [];
        ret.forEach(function (beauty) {
            html += '<div class="service-item" data-event="openNewWin" data-params=\'{"name":"';
            html += beauty['type'] == 1 ? 'win_cargo_goods' : beauty['type'] == 2 ? 'win_cargo_item' : '';
            html += '","param":{"id":"';
            html += beauty['id'];
            html += '","shop_id":"';
            html += self.$data['id'];
            html += '"}}\'><div class="thumb" data-echo-background="';
            html += beauty['thumb'] || '';
            html += '"></div><div class="title">';
            html += beauty['title'] || '';
            html += '</div><div class="price">¥<span>';
            html += beauty['offer_money'];
            html += '</span></div><div class="number">月销量  ';
            html += beauty['sales'];
            html += '</div></div>';
        });
        return html;
    };
    app.prototype._iScroll = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        if( !ret['count'] || ret['count'] < self.size ) {
            self.$loadMore.text('后面没有了')
            return callback();
        };
        self.$loadMore.text('努力加载中');
        self.SCROLL.addListenerToBottom(function () {
            self._one();
        });
        callback();
    };
    app.prototype._ajax = function (callback) {
        var self = this;
        callback = $.callback(callback);

        $.ajax({
            url : self.$url ,
            data : {
                shop_id : self.$data['id'],
                page : self.page ,
                size : self.size ,
            }
        }).then(callback);
    };
    return $.storeBeauty = function () {
        return new app();
    };
}();