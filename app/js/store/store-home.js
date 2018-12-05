;~function () {

    var app = function () {
        this.$data = api.pageParam;
        this.$title = $('[data-selector="title"]');
        this.$cover = $('[data-selector="cover"]');
        this.$nav = $('[data-selector="nav-item"]');
    };
    /**
     * todo : 静态属性 请求地址
     * @type {string}
     */
    app.__proto__.$url = 'mall/shop/index';


    app.prototype.init = function () {
        var self = this;
        self._main();
    };
    /**
     * todo : 主入口位置
     * desc : 1. 请求店铺详细
     *        2. 设置封面
     * @private
     */
    app.prototype._main = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self._ajax(cb);
            },
            function ( ret , cb ) {
                self._set_store_cover(ret , cb);
            }
        ],function (err,ret) {
            if(err) return ;
            self._open_store_group(ret);
            self._event();
        });
    };
    app.prototype._set_store_cover = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        // 'info 不存在';
        if( !ret['info'] || typeof ret['info'] != 'object' ) return callback(null , ret);
        // 'set title';
        self.$title.text( ret['info']['name'] || '绝世好店' );
        // set cover
        if( !ret['info']['thumbs'].length || !ret['info']['thumbs'][0]['path'] ) return callback(null , ret);
        self.$cover.css('background-image' , 'url("' + ret['info']['thumbs'][0]['path'] + '")' ) ;
        return callback(null , ret);
    };
    /**
     * todo : 请求店铺信息
     * @param callback
     * @private
     */
    app.prototype._ajax = function (callback) {
        var self = this;
        callback = $.callback( callback );
        $.ajax({
            url : app.$url ,
            data : {
                shop_id : self.$data.id || 0
            }
        }).then( callback );
    };
    app.prototype._open_store_group = function (ret) {
        var self = this;
        ret = $.extend( {}, ret , self.$data );
        api.openFrameGroup({
            name: '-group-store-home',
            background: '#ededed',
            scrollEnabled: true,
            rect: {
                x: 0,
                y: 203,
                w: 'auto',
                h: 'auto'
            },
            index: 0,
            frames: [{
                name: '-frame-store-index',
                url: 'widget://html/store/store-index.html',
                bgColor: '#ededed',
                pageParam : ret,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                bounces : false
            }, {
                name: '-frame-store-beauty',
                url: 'widget://html/store/store-beauty.html',
                bgColor: '#ededed',
                pageParam : self.$data,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                customRefreshHeader : 'UIPullRefresh'
            }, {
                name: '-frame-store-benefit',
                url: 'widget://html/store/store-benefit.html',
                bgColor: '#ededed',
                pageParam : self.$data,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                customRefreshHeader : 'UIPullRefresh'
            }, {
                name: '-frame-store-index',
                url: 'widget://html/store/store-introduction.html',
                bgColor: '#ededed',
                pageParam : self.$data,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                bounces : false
            }]
        }, function(ret, err) {
            if(err) return false;
            self._switch_nav(ret.index || 0);
        });
    };
    app.prototype._switch_nav = function (i) {
        var self = this;
        self.$nav.removeClass('active').eq(i).addClass('active');
    };
    app.prototype._event = function () {
        var self = this;
        self.$nav.on('tap' , function () {
            var i = $(this).index();
            $.api.switchPageIndex('-group-store-home' , i , true);
        });
        // 接收滚动事件 , 处理动画
        $.api.listenerEvent('-event-store-scroll' , function (ret) {

        });
    };
    return $.storeHome = function () {
        return new app();
    };
}();