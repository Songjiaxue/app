;~function () {

    var app = function () {
        this.size = 10;
        this.page = 1;
        this.zone_id = '';
        this.$loadMore = $('._load-more');
        this.pullRefresh = $.pullRefresh();
        this.homeIndex = $.homeIndex();
        this.scroll = $.scroll();
    };
    app.prototype.init = function () {
        this.main(); //主线进程
        this.refresh();
    };

    app.prototype.main = function () {
        var self = this;
        self.page = 1;
        self.one();
    };
    app.prototype.refresh = function () {
        var self = this;
        self.pullRefresh.set(function () {
            self.main();
        });
    };
    app.prototype.one = function () {
        var self = this;
        // 关闭下拉
        self.pullRefresh.close();
        // 取消滚动监听
        self.scroll.removeListenerToBottom();

        async.waterfall([
            function (cb) {
                self.ajax(cb);
            },
            function (ret , cb) {
                self.homeIndex.beauty_html( ret ,cb);
            },
            function (ret ,cb) {
                self.iScroll( ret , cb);
            }
        ],function (err,ret) {
            $.echo();
            if(err) return $.api.toast(err);
            self.page += 1;
        })
    };
    app.prototype.iScroll = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        if( !ret.data.info.length || ret.data.info.length < self.size ) {
            self.$loadMore.text('后面没有了')
            return callback();
        };
        self.$loadMore.text('努力加载中');
        self.scroll.addListenerToBottom(function () {
            self.one();
        });
        callback();
    };
    app.prototype.ajax = function ( callback ) {
        var self = this,
            city = JSON.parse(localStorage.city);
        callback =$.callback(callback);
        $.ajax({
            url : 'mall/shop/list',
            data : $.extend({}, typeof city == 'object' ? {
                longitude : city.lon ,
                latitude : city.lat,
                city_id : city.city.id
            } : {
                longitude : 0 ,
                latitude : 0,
                city_id : 0
            },{
                page : self.page,
                size : self.size,
                zone_id : self.zone_id
            })
        }).then(callback)
    };
    return $.beautyIndex = function () {
        return new app();
    };
}();