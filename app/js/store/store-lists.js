;~function () {

    var app = function () {
        this.userLocation = JSON.parse( localStorage['userLocation'] );
        this.page = 1;
        this.size = 10;
        this.zoneId = typeof void 0;
        this.$storeLists = $('[data-selector="store-lists"]');
        this.$loadMore = $('._load-more');
        this.SCROLL = $.scroll();
        this.pullRefresh = $.pullRefresh();
        this.TOAST = $.toast();
    };

    app.prototype.init = function () {
        var self = this;
        self._refresh();
        self._main();
    };
    /**
     * todo : 设置下拉刷新
     * @private
     */
    app.prototype._refresh = function () {
        var self = this;
        self.pullRefresh.set(function () {
            self._main();
        });
    };
    /**
     * todo : main方法
     * desc : 重置page值
     * @private
     */
    app.prototype._main = function () {
        var self = this;
        self.page = 1;
        self._one();
    };
    /**
     * todo : 根据参数或群数据 ， 并且加入html
     * @private
     */
    app.prototype._one = function () {
        var self = this;
        self.pullRefresh.close();
        self.SCROLL.removeListenerToBottom();
        async.waterfall([
            function (cb) {
                self.ajax(cb);
            },
            function (ret , cb) {
                self._append(ret , cb);
            },
            function (ret , cb) {
                self._iScroll(ret , cb);
            }
        ],function (err,ret) {
            $.echo();
            self._end();
            if(err) return false;
            self.page += 1;
        });
    };
    /**
     * todo : 添加html元素
     * @param ret
     * @param callback
     * @private
     */
    app.prototype._append = function (ret , callback) {
        var self = this;
        self.$storeLists[self.page == 1 ? 'html' : 'append']( self._store_lists_html(ret) );
        callback(null,ret);
    };
    /**
     * todo : 判断是否还有数据
     * @param ret
     * @param callback
     * @returns {*}
     * @private
     */
    app.prototype._iScroll = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        if( !ret['info'].length ||ret['info'].length < self.size ) {
            self.$loadMore.text('后面没有了')
            return callback();
        };
        self.$loadMore.text('努力加载中');
        self.SCROLL.addListenerToBottom(function () {
            self._one();
        });
        callback();
    };
    /**
     * todo : html element
     * @param argument
     * @returns {string}
     * @private
     */
    app.prototype._store_lists_html = function (argument) {
        var html = '';
        if(typeof argument != 'object' ||  argument['count'] <= 0) return html;
        argument['info'].forEach(function (store) {
            html += '<div class="list-item" data-event="openNewWin" data-params=\'{"name":"win_store_home","param":{"id":"';
            html += store['id'];
            html += '"}}\'><div class="list-item-left" data-echo-background="';
            html += store['logo'];
            html += '"></div><div class="list-item-right"><div class="list-item-title"><p>';
            html += store['name'];
            html += '</p></div><div class="list-item-info">';
            html += store['description'];
            html += '</div><div class="list-item-addr"><div class="addr-left">【地址】';
            html += store['address'];
            html += '</div><div class="addr-right"><i class="icon-place"></i><span>&lt;';
            html += store['distance'] < 1 ? Math.floor( store['distance'] * 1000 ) + 'm' : Math.floor( store['distance'] ) + 'km';
            html += '</span></div></div><div class="list-item-review">';
            [1,2,3,4,5].forEach(function (star) {
                if( star <= store['star']) return html += '<i class="icon-star active"></i>';
                return html += '<i class="icon-star"></i>';
            });
            html += '<span>'+ store['bbs_count'] +'人评价</span>'
            html += '</div></div></div>';
        });
        return html;
    };
    /**
     * 供给home-index调用的函数
     * @param argument
     * @param callback
     * @returns {*}
     * @private
     */
    app.prototype._store_lists_end = function (argument ,callback) {
        var self = this;
        $.echo();
        if(typeof argument != 'object' ||  argument['count'] < 10) return callback(self.$loadMore.text('到底啦'));
        self.page += 1;
        callback();
    };
    /**
     * ajax获取数据
     * @param callback
     */
    app.prototype.ajax = function (callback) {
        var self = this;
        callback = $.callback( callback );
        $.ajax({
            url : 'mall/shop/list',
            data : {
                longitude : self.userLocation.lon ,
                latitude : self.userLocation.lat ,
                city_id : self.userLocation.city.id ,
                zone_id : self.zoneId == typeof void 0 ? '' : self.zoneId ,
                page : self.page ,
                size : self.size
            }
        }).then(callback);
    };
    /**
     * 结束函数 ， 关闭加载菜单
     * @private
     */
    app.prototype._end = function () {
        var self = this;
        setTimeout(function () {
            self.TOAST.load().Progress();
        },500);
    };
    return $.storeLists = function () {
        return new app();
    };
}();