/**
 * Created by Administrator on 2016/8/26.
 */
;~function () {
    var app = function () {
        this.pullRefresh = $.pullRefresh();
        this.SCROLL = $.scroll();
        this.page = 1;
        this.size = 10;
        this.$htmlContent = $('[data-selector="html-content"]');
        this.$loadMore = $('._load-more');
        this.$toast = $('._toast');
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
            function (ret,cb) {
                self._append_html(ret , cb);
            },
            function ( ret , cb ) {
                self._iScroll( ret , cb );
            }
        ],function (err) {
            $.echo();
            self._end();
            if(err) return $.api.toast(err);
            self.page += 1;
        });
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
            self.$loadMore.text('到底啦');
            return callback();
        };
        self.$loadMore.text('努力加载中');
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
            url : 'bbs/article/list',
            data : {
                page : self.page ,
                column_id : api.pageParam.id || 0 ,
                size : self.size || 10
            }
        }).then( callback );
    };
    app.prototype._html = function ( ret ) {
        ret = ret.info || [];
        var self = this,
            html = '';
        ret.forEach(function (item , i) {
            html += '<div class="lists-item ';
            if(!!(self.page - 1))html += 'animated fadeIn';
            html += '" data-event="openNewWin" data-params=\'{"name":"';
            html += item.is_link ? 'win_url' : 'win_bbs_details';
            html += '","param":{"url":"';
            html += item.link;
            html += '","id":"';
            html += item.id;
            html += '","type":"official"}}\'><div class="lists-head"><div class="head" data-echo-background="';
            html += item.head || '../../images/img.png';
            html += '"></div><div class="nickname">';
            html += item.writer;
            html += '</div></div><div class="lists-img" data-echo-background="';
            html += item.thumb;
            html += '"></div><div class="lists-desc">';
            html += item.description;
            html += '</div><div class="lists-tools"><div class="tools-group"><div class="tools-item">';
            html += item.ago || '冰河世纪';
            html += '</div></div><div class="tools-group"><div class="tools-item"><div class="icon icon-share"></div></div><div class="tools-item ml15"><div class="icon icon-love "></div>';
            html += '<div class="pink">（';
            html += item.good || '0';
            html += '）</div></div></div></div><div class="lists-review">';
            html += '<div class="review-warp"><div class="review-icon icon-mes"></div><div class="review-context">';
            item.comment = item.comment || [];
            item.comment.forEach(function (comment) {
                html += '<div class="review-item">';
                html += comment.nick + ' : ' + comment.content;
                html += '</div> ';
            });
            html += '<div class="review-item">查看全部评论（';
            html += item.comment_count || '0';
            html += '）</div></div></div></div></div>';
        });
        return html;
    };
    app.prototype._append_html = function ( ret , callback ) {
        var self = this,
            fn = self.page == 1 ? 'html' : 'append';
        self.$htmlContent[fn]( self._html(ret) );
        callback( null , ret );
    };
    app.prototype._end = function () {
        var self = this;
        setTimeout(function () {
            self.$toast.hide().siblings('._main').addClass('show');
        },500);
    };
    $.bbsOfficial = function () {
        return new app();
    }
}();