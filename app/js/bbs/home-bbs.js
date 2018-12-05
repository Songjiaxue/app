;~function () {

    var app = function () {
        this.$data = api.pageParam;
        this.$url = 'bbs/Article/column';
        this.$headerItem = $('[data-selector="header-item"]');
        this.$nav = $('[data-selector="nav"]');
        this.$indexNav = $('[data-selector="index-nav"]');
        this.$personalNav = $('[data-selector="personal-nav"]');
    };
    app.prototype.init = function () {
        var self = this;
        self._main();
    };
    /**
     * todo : 本模块入口函数
     * @private
     */
    app.prototype._main = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self._append_column(cb);
            }
        ],function () {
            self._event();
        });
    };
    /**
     * todo : 事件集合
     *        1. nav-item 点击事件
     *        2. 监听页面组切换事件
     *        3. header-item 点击事件
     * @private
     */
    app.prototype._event = function () {
        var self = this;
        //
        self.$indexNav.find('.nav-item').on('click' , function () {
            var $this = $(this),
                i = $this.data('index');
            self._switch_bbs_group_index(false , i);
        });
        self.$personalNav.find('.nav-item').on('click' , function () {
            var $this = $(this),
                i = $this.data('index');
            self._switch_bbs_group_index(true , i);
        });
        self._listener_switch_home_bbs_group();
        self.$headerItem.on('click' , function () {
            var $this = $(this),
                $index = $this.index();
            return self._switch_bbs_header($this,$index);
        });
    };
    /**
     * todo : header-item 点击切换事件
     * @param $this
     * @param $index
     * @private
     */
    app.prototype._switch_bbs_header = function ($this,$index) {
        var self = this;
        !$index ? self._switch_bbs_group_index(false , self.$indexNav.find('.nav-item[class*="active"]').index() ) : self._switch_bbs_group_index(true , self.$personalNav.find('.nav-item[class*="active"]').index() );
    };

    /**
     * todo : 点击修改home-bbs-group 的index
     * @param flag
     * @param i
     * @private
     */
    app.prototype._switch_bbs_group_index = function (flag , i) {
        var self = this;
        if( flag ) i += self.$data.info.length;
        $.api.switchPageIndex('home-bbs-group' , i , true);
    };
    /**
     * todo : 监听页面组切换
     * @private
     */
    app.prototype._listener_switch_home_bbs_group = function () {
        var self = this;
        $.api.listenerEvent('_event_switch_home_bbs_group' , function (ret) {
            if( ret.index >= self.$data['count']) return self._switch_bbs_nav(self.$personalNav , ret.index - self.$data['count'] , 1);
            return self._switch_bbs_nav(self.$indexNav , ret.index , 0);
        });
    };
    /**
     * todo : 样式切换
     * @param $this
     * @param i
     * @param $i
     * @private
     */
    app.prototype._switch_bbs_nav = function ($this , i , $i) {
        var self = this;
        // 隐藏另一个表单
        self.$nav.eq($i).addClass('show').siblings().removeClass('show');
        self.$headerItem.eq($i).addClass('active').siblings().removeClass('active');
        $this.find('.nav-item').eq(i).addClass('active').siblings().removeClass('active');
    };
    /**
     * todo : 获取热点分类
     * desc : 数据请求失败时，使用本地缓存 *default 全部 id : 0
     * @param callback
     */
    app.prototype.ajax = function (callback) {
        var self = this;
        callback = typeof callback == 'function' ? callback : function () {};
        $.ajax({
            url : self.$url
        }).then(function (err,ret) {
            if(err) return callback(null, self._get_cache() );
            self._cache( ret );
            callback(err,ret);
        });
    };
    /**
     * todo : 返回菜单html
     * @returns {string}
     * @private
     */
    app.prototype._column_html = function () {
        var self = this,
            html = '';
        self.$data.info.forEach(function (column , i) {
            if(i == 0) {
                html += '<div class="nav-item active" data-index="';
            }else{
                html += '<div class="nav-item" data-index="';
            };
            html += i;
            html += '">';
            html += column.name;
            html += '</div>';
        });
        return html;
    };
    /**
     * todo : 添加菜单html
     * @param callback
     * @private
     */
    app.prototype._append_column =function ( callback ) {
        var self = this;
        callback =$.callback( callback );
        self.$indexNav.html( self._column_html() );
        callback();
    };
    /**
     * todo : 获得 bbs-page-group 内容
     * @param argument
     * @returns {Array}
     */
    app.prototype.set_bbs_page_group = function (argument) {
        var frames = [];
        // 热点窗口组内容
        argument['info'].forEach(function (item , i) {
            frames.push({
                name : 'frame-bbs-official-' + i,
                url  : 'widget://html/bbs/bbs-official.html',
                pageParam:{
                    id : item.id
                },
                bounces : true,
                bgColor : '#ededed',
                vScrollBarEnabled : false,
                hScrollBarEnabled : false,
                customRefreshHeader : 'UIPullRefresh'
            });
        });
        // 姐妹说窗口组
        // 论坛
        frames.push({
            name : 'frame-bbs-other-1',
            url  : 'widget://html/bbs/bbs-other.html',
            bounces : true,
            bgColor : '#ededed',
            vScrollBarEnabled : false,
            hScrollBarEnabled : false,
            customRefreshHeader : 'UIPullRefresh'
        });
        // 我的发布
        frames.push({
            name : 'frame-bbs-my',
            url  : 'widget://html/bbs/bbs-my.html',
            bounces : true,
            bgColor : '#ededed',
            vScrollBarEnabled : false,
            hScrollBarEnabled : false,
            customRefreshHeader : 'UIPullRefresh'
        });
        // 我的点赞
        frames.push({
            name : 'frame-bbs-laud',
            url  : 'widget://html/bbs/bbs-laud.html',
            bounces : true,
            bgColor : '#ededed',
            vScrollBarEnabled : false,
            hScrollBarEnabled : false,
            customRefreshHeader : 'UIPullRefresh'
        });
        // 我的评论
        frames.push({
            name : 'frame-bbs-comment',
            url  : 'widget://html/bbs/bbs-comment.html',
            bounces : true,
            bgColor : '#ededed',
            vScrollBarEnabled : false,
            hScrollBarEnabled : false,
            customRefreshHeader : 'UIPullRefresh'
        });
        return frames;
    };
    /**
     * todo : 请求分类成功后，缓存数据到本地，供下次使用
     * desc : key = homeBbs
     * @param ret
     * @private
     */
    app.prototype._cache = function (ret) {
        localStorage.homeBBs = JSON.stringify(ret);
    };
    /**
     * todo : 设置
     * @private
     */
    app.prototype._get_cache = function () {
        if( typeof localStorage.homeBBs == typeof void 0 ) localStorage.homeBBs = JSON.stringify(
            {
                info:[
                    {id : 0,name:'全部'}
                ]
            }
        );
        return JSON.parse(localStorage.homeBBs);
    };
     $.homeBbs = function () {
        return new app();
     };
}();