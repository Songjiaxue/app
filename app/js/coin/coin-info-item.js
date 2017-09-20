;~function () {

    var app = function () {
        this.page = 1;
        this.size = 10;
        this.type = api.pageParam.type;
        this.$wrap = $('[data-selector="item-wrap"]');
        this.scroll = $.scroll();
        this.pullRefresh = $.pullRefresh();
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
        self.scroll.removeListenerToBottom();
        async.waterfall([
            function (cb) {
                self._ajax( cb );
            },
            function (ret ,cb) {
                self._append( ret , cb );
            },
            function (ret , cb) {
                self._iscroll(ret,cb);
            }
        ],function (err) {
            $.echo();
            self.pullRefresh.close();
            if(err) return $.api.toast(err);
            self.page += 1;
        });
    };
    app.prototype._html = function (ret) {
        var html = '';
        ret['info'].forEach(function (info) {
            html += '<div class="lists-item"><div class="case">';
            html += info.reason;
            html += '</div><div class="time">';
            html += info.create_time;
            html += '</div><div class="coin">+';
            html += info.point;
            html += '</div></div>';
        });
        return html;
    };
    app.prototype._append = function ( ret  , callback) {
        var self = this,
            fn = self.page == 1 ? 'html' : 'append';
        self.$wrap[fn]( self._html(ret) );
        callback( null , ret );
    };
    app.prototype._iscroll = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        if( !ret['count'] || ret['count'] < self.size ) {
            self.$loadMore.text('后面没有了')
            return callback();
        };
        self.$loadMore.text('努力加载中');
        self.scroll.addListenerToBottom(function () {
            self._one();
        });
        callback();
    };
    app.prototype._delete = function (ret) {
        var id = ret.id;
        $.confirm('删除订单' , '是否删除此订单?注意：删除后不可恢复',function ($f) {
            if(!$f) return false;
            $('[data-selector="'+ id +'"]').remove();
        });

    };
    app.prototype._ajax = function (callback) {
        callback = $.callback( callback );
        var self = this;
        $.ajax({
            url : 'member/bill/point',
            data : {
                page : self.page,
                size : self.size,
                type : self.type
            }
        }).then(callback);
    };
    return $.coinInfoItem = function () {
        return new app();
    };
}();