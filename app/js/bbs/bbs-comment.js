
;~function () {

    var app = function () {
        this.pullRefresh = $.pullRefresh();
        this.SCROLL = $.scroll();
        this.page = 1;
        this.size = 10;
        this.$htmlContent = $('[data-selector="html-content"]');
        this.$loadMore = $('._load-more');
        this.$login = $('[data-selector="login"]');
    };
    /**
     * 官方热点论坛列表入口
     * @desc 配置了下拉刷新组件与入口数据操作
     * */
    app.prototype.init = function () {
        var self = this;
        self.refresh();
        self._main();
    };

    app.prototype._main = function () {
        var self = this;
        self.page = 1;
        self._one();
    };
    app.prototype._one = function () {
        var self = this;
        //取消监听到底部事件
        self.SCROLL.removeListenerToBottom();
        //关闭下拉刷新
        self.pullRefresh.close();
        async.waterfall([
            function ( cb ) {
                self._ajax( cb );
            },
            function ( ret , cb ) {
                self._append_html(ret , cb);
            },
            function ( ret , cb ) {
                self._iScroll( ret , cb );
            }
        ],function (err) {
            $.echo();
            if(err) return self._error(err);
            self.page += 1;
        });
    };
    app.prototype._error = function (err) {
        var self = this;
        $.api.toast(err);
        self.$loadMore.hide();
        if( typeof err != 'object') return false;
        switch (parseInt(err.status)){
            case 10000 :
                self._login();
                break;
        };
    };
    app.prototype._login = function () {
        var self = this;
        self.$login.removeClass('hide');
    };
    /**
     * 配置下拉刷新，下拉刷新时，初始化page与加载更多的样式
     */
    app.prototype.refresh = function () {
        var self = this;
        self.pullRefresh.set(function () {
            self._main();
        });
    };
    app.prototype._iScroll = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        if( !ret['count'] || ret['count'] < self.size ) {
            self.$loadMore.show().text('到底啦');
            return callback();
        };
        self.$loadMore.show().text('努力加载中');
        self.SCROLL.addListenerToBottom(function () {
            self._one();
        });
        callback();
    };
    /**
     * 获得官方列表数据
     * @param callback
     */
    app.prototype._ajax = function (callback) {
        var self = this;
        callback = $.callback(callback);
        $.ajax({
            url : 'member/bbs/comment',
            data : {
                page : self.page ,
                column_id : api.pageParam.id || 0 ,
                size : self.size || 10
            }
        }).then( callback );
    };
    app.prototype._html = function ( ret ) {
        var db = ret['count'] ? ret['info'] : [];
        var html = '';
        db.forEach(function (item) {
            html += '<div class="main-item"><div class="head"><div class="head-avatar" data-echo-background="';
            html += ret['user']['avatar'];
            html += '"></div><div class="head-name">';
            html += ret['user']['nick'];
            html += '</div></div><div class="content"><div class="content-talk">';
            html += item['comment'] || '';
            html += '</div><div class="content-link"><div class="content-link-in">';
            html += item['content'] || '';
            html += '</div></div><div class="content-tool"><div class="content-tool-item">';
            html += item['ago'];
            html += '</div><div class="content-tool-item icon-love"></div></div></div></div>';
        });
        return html;
    };
    app.prototype._append_html = function ( ret , callback ) {
        var self = this,
            fn = self.page == 1 ? 'html' : 'append';
        self.$htmlContent[fn]( self._html( ret ) );
        callback( null , ret );
    };

    return $.bbsComment = function () {
        return new app();
    };
}();