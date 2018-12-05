


;~function () {
    var app = function () {
        this.id = api.pageParam.id;
        this.$thumb = $('[data-selector="thumb-banner"]');
        this.$info = $('[data-selector="details-info"]');
        this.$title = $('[data-selector="details-title"]');
        this.$tag = $('[data-selector="details-tag"]');
        this.$content = $('[data-selector="details-content"]');
        this.$assess = $('[data-selector="details-assess"]');
        this.$assessCount = $('[data-selector="assess-count"]');
    };
    app.prototype.init = function () {
        var self = this;
        self.main();
    };

    /**
     * todo : 获得商品详细信息、
     * desc : 获得商品详细信息并且展现
     */
    app.prototype.main = function () {
        var self = this;
        async.waterfall([
            function ( cb ) {
                //获取全部数据
                self.ajax( cb );
            },
            function ( ret , cb ) {
                //设置图片集
                self.setThumb( ret , cb );
            },
            function (ret , cb) {
                //设置价格信息
                self.setInfo( ret ,cb );
            },
            function (ret , cb) {
                //设置标题
                self.setTitle( ret ,cb );
            },function (ret , cb) {
                //设置标签
                self.setTag(ret , cb);
            },
            function (ret ,cb) {
                //设置商品详情
                self.setContent(ret , cb);
            },
            function (ret , cb) {
                //设置评论
                self.setAssess(ret , cb);
            }
        ],function ( err , ret ) {
            if(err) return $.api.toast(err);
            $.echo();
            $.app.swipe();
        });
    };
    /**
     * todo : 设置商品图片集
     * @param ret ajax请求的数据
     * @param callback 填充完成回调函数
     */
    app.prototype.setThumb = function (ret,callback) {
        var self = this;
        self.$thumb.html( self.thumbBannerHtml(ret) );

        callback(null ,ret);
    };
    /**
     * todo : 图片集的html
     * @param ret ajax请求的数据
     * @returns {string} html元素
     */
    app.prototype.thumbBannerHtml = function (ret ) {
        var self = this,
            thumbs = ret.data.thumb_url || [],
            html = '';
        html += '<div class="banner-warp js-slider swipe"><div class="banner-group swipe-wrap">';
        thumbs.forEach(function (thumb) {
            html += '<div class="banner-item" data-echo-background="';
            html += thumb.path;
            html += '"></div>';
        });
        html += '</div></div>';
        return html;
    };
    /**
     * todo : 设置价格信息
     * @param ret
     * @param callback
     */
    app.prototype.setInfo = function (ret,callback) {
        var self = this;
        self.$info.html( self.infoHtml(ret) );
        callback(null ,ret);
    };
    /**
     * todo : 价格信息html
     * @param ret
     * @returns {string}
     */
    app.prototype.infoHtml = function (ret) {
        var html = '',
            db = ret.data;
        html += '<div class="price fl icon icon-score">';
        html += db.offer_point;
        html += '</div><div class="price over fl small">已售';
        html += db.sales;
        html += '</div><div class="price over fl small">剩余';
        html += db.stock;
        html += '</div>';
        return html;
    };
    /**
     * todo : 设置标题
     * @param ret
     * @param callback
     */
    app.prototype.setTitle = function (ret,callback) {
        var self = this;
        self.$title.text(ret.data.title);
        callback( null , ret);
    };
    /**
     * todo : 设置标签
     * desc : 设置是否为新品，爆款等标签
     * @param ret
     * @param callback
     */
    app.prototype.setTag = function (ret , callback) {
        var self = this;
        self.$tag.html( self.tagHtml( ret ) );
        callback( null , ret);
    };
    /**
     * todo :　标签html
     * @param ret
     * @returns {string}
     */
    app.prototype.tagHtml = function (ret) {
        var html = '',
            db = ret.data;
        html += '<div class="ui-tool icon-gt border"><div class="ui-tool-in"><div class="ui-tool-group">';
        if(!!db.is_new) html += '<div class="ui-tool-item"><div class="ui-tool-icon">新</div><div class="ui-tool-desc">新品推荐</div></div>';
        if(!!db.is_hot) html += '<div class="ui-tool-item"><div class="ui-tool-icon">热</div><div class="ui-tool-desc">热门兑换</div></div>';
        html += '</div></div></div>'
        return html;
    };
    /**
     * todo : 设置商品详情html
     * @param ret
     * @param callback
     */
    app.prototype.setContent = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        self.$content.html(ret.data.content || '');
        callback(null ,ret);
    };
    /**
     * todo : 中途修改事件参与，以及更新评论数量
     * @param ret
     */
    app.prototype.setAssessAount = function (ret) {
        var self = this;
        var html = '<div class="ui-tool-item" data-event="openNewWin" data-params=\'{"name":"win_coin_assess","param":{"id":"';
        html += self.id;
        html += '"}}\'><div class="ui-tool-desc">宝贝评价（';
        html += ret.data.comment_count;
        html += '）</div></div>';
        self.$assessCount.html( html )
    };
    /**
     * todo : 添加评论
     * @param ret
     * @param callback
     */
    app.prototype.setAssess = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        self.setAssessAount(ret);
        self.$assess.html( self.assessHtml(ret) );
        callback(null ,ret);
    };
    /**
     * todo : 评论详情html
     * @param ret
     * @returns {string}
     */
    app.prototype.assessHtml = function (ret) {
        var html = '',
        db = typeof ret.data.comment === typeof void 0 || !ret.data.comment.length ? [] : ret.data.comment;
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
    /**
     * todo : 执行主线ajax请求
     * @param callback 请求成功的回调函数
     */
    app.prototype.ajax = function (callback) {
        var self = this;
        $.ajax({
            url : 'mall/point/detail',
            data : {
                goods_id : self.id
            },
            cache : false
        }).then(callback);
    };
    return $.coinDetails = function () {
        return new app();
    }
}();