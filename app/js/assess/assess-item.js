
;~function () {

    var app = function () {
        this.id = api.pageParam.id;
        // todo : 评论类别区别码 0 : 全部 ， 1 : 好评 ， 2 : 中评 , 3 : 差评
        this.type = api.pageParam.type;
        this.page = 1;
        this.size = 10;
        this.pullRefresh = $.pullRefresh();
        this.scroll = $.scroll();
        this.$loadMore = $('._load-more');
        this.$assess = $('[data-selector="details-assess"]');
    };
    /**
     * todo : 首次加载的执行函数
     */
    app.prototype.init = function () {

        this.main();
        this.refresh();
    };
    app.prototype.main = function () {
        this.page = 1;
        this.one();
    };
    /**
     * todo : 配置下拉刷新组件以及其回调函数
     * desc : 重设page = 1 , 并重新执行主入口请求
     */
    app.prototype.refresh = function () {
        var self = this;
        self.pullRefresh.set(function () {
            self.main();
        })
    };
    app.prototype.one = function () {
        var self = this;
        //取消监听到底部事件
        self.scroll.removeListenerToBottom();
        //关闭下拉刷新
        self.pullRefresh.close();
        //请求当前页面的数据，并填充到页面
        async.waterfall([
            function ( cb ) {
                self.ajax( cb );
            },
            function (ret,cb) {
                self.innerHtml(ret,cb);
            },
            function ( ret , cb ) {
                self.iScroll(ret,cb);
            }
        ],function (err) {
            //错误操作
            $.echo();
            if(err) return $.api.toast(err);
            //提升页码
            self.page += 1;
        });
    };
    app.prototype.iScroll = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        if( !ret['info'].length ||ret['info'].length < self.size ) {
            self.$loadMore.text('后面没有了')
            return callback();
        };
        self.$loadMore.text('努力加载中');
        self.scroll.addListenerToBottom(function () {
            self.one();
        });
        callback();
    };
    app.prototype._itemHtml = function (ret) {
        var html = '',
            db = typeof ret['info'] === typeof void 0 || !ret['info'].length ? [] : ret['info'];
        db.forEach(function (assess) {
            html += '<div class="lists-item"><div class="title"><div class="head" data-echo-background="';
            html += assess.avatar;
            html += '"></div><div class="nickname">';
            html += assess.nick;
            html += '</div></div><div class="desc">';
            html += assess.content;
            html += '</div><div class="end">';
            html += assess.ago;
            html += ' - 产品类型 : ';
            html += '积分商品';
            html += '</div></div>';
        });
        return html;
    };
    app.prototype.innerHtml = function (ret , callback) {
        var self = this;
        callback = $.callback( callback );
        if(self.page == 1) self.$assess.html( self._itemHtml(ret) );
        if(self.page != 1) self.$assess.append( self._itemHtml(ret) );
        callback(null , ret);
    };
    /**
     * todo : 主线ajax请求
     * desc : 请求当前配置下的数据，并返回给callback
     * @param callback : function ajax请求完成后的回调函数
     */
    app.prototype.ajax = function (callback) {
        var self = this;
        callback = $.callback( callback );
        $.ajax({
            url : 'mall/point/comment',
            cache : false,
            data : {
                goods_id : self.id ,
                type : self.type ,
                page : self.page ,
                size : self.size
            }
        }).then( callback )
    };
    return $.assessItem = function () {
        return new app();
    }
}();