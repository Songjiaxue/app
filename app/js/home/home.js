/**
 * todo : root 窗口
 */


;~function () {
    var app = function () {
        this.BBS = $.homeBbs();
        this.userLocation; // 用户上次地理位置信息
        this.bbsPageGroup; // bbs组内容
    };
    app.prototype.init = function () {
        var self = this;
        self._default_location();
        self.main();
    };
    /**
     * todo : 主函数入口
     * desc : 请求bbs分类信息 => 根据分类信息获得bbs页面组 => 打开首页页面组 => 打开主页导航 => 打开欢迎页面
     */
    app.prototype.main = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self.BBS.ajax(cb);
            },
            function (ret , cb) {
                self.bbs_page_group(ret,cb);
            },
            function (ret ,cb) {
                self.open_home_page_group(ret , cb);
            },
            function (cb) {
                self.open_home_footer(cb);
            },
            function (cb) {
                self._welcome(cb);
            }
        ],function ( err , ret ) {

        });
    };
    /**
     * todo : 打开主页导航
     * desc : 在 root 窗口 打开脚步导航 bottom : 0 ; height : 45px; 传入bbs页面数据组
     * @param callback
     */
    app.prototype.open_home_footer = function (callback) {
        var self = this;
        callback = $.callback( callback );
        api.openFrame({
            name: 'home-footer',
            url: 'widget://html/home-footer.html',
            rect: {
                x: 0,
                y: api.winHeight - 45,
                w: 'auto',
                h: 45
            },
            bounces: false,
            bgColor: '#ffffff',
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            pageParam : self.bbsPageGroup
        });
        callback();
    };
    /**
     * todo : 打开欢迎页面
     * desc : 默认全屏 ， 传入缓存中的类型 ，方便以后的引导或者广告判断
     * @param callback
     * @private
     */
    app.prototype._welcome = function (callback) {
        var self = this,
            callback = $.callback( callback );
        $.app.switch('openNewWin',{name:'win_welcome',param:{"type":typeof localStorage.welcome == typeof void 0}});
        callback();
    };
    /**
     * todo : 打开首页窗口组,传入固定参数
     * desc : home-bbs 传入bbs分类 ， 默认全部 ， home-index 传入了缓存中的地理位置 ，进入口在再次请求位置
     * @param argument
     * @param callback
     */
    app.prototype.open_home_page_group = function (argument , callback) {
        var self = this;
        callback = $.callback( callback );
        api.openFrameGroup ({
            name: 'home-page-group',
            scrollEnabled: false,
            preload : 4,
            index : 0,
            rect: {
                marginLeft : 0 ,
                marginRight : 0,
                marginTop : 20,
                marginBottom : 45,
            },
            frames: [
                {
                    name: 'home-index',
                    url: 'widget://html/home-index.html',
                    bounces: false,
                    bgColor : '#ededed',
                    vScrollBarEnabled: false,
                    hScrollBarEnabled: false,
                    pageParam : self.userLocation
                },{
                    name: 'coin-index',
                    url: 'widget://html/home-coin.html',
                    bounces: false,
                    bgColor : '#ededed',
                    vScrollBarEnabled: false,
                    hScrollBarEnabled: false
                },{
                    name: 'beauty-index',
                    url: 'widget://html/home-beauty.html',
                    bounces: false,
                    bgColor : '#ededed',
                    vScrollBarEnabled: false,
                    hScrollBarEnabled: false,
                },{
                    name: 'bbs-index',
                    url: 'widget://html/home-bbs.html',
                    bounces: false,
                    bgColor : '#ededed',
                    pageParam : argument,
                    vScrollBarEnabled: false,
                    hScrollBarEnabled: false
                },{
                    name: 'user-index',
                    url: 'widget://html/home-user.html',
                    bounces: false,
                    bgColor : '#ededed',
                    vScrollBarEnabled: false,
                    hScrollBarEnabled: false
                }
            ]
        } , function (ret) {
        });
        callback();
    };
    /**
     * todo : 获得bbs-group 的分类数组
     * desc : 存放在bbsPageGroup中
     * @param argument
     * @param callback
     */
    app.prototype.bbs_page_group = function (argument , callback) {
        var self = this,
            callback = $.callback( callback );
        self.bbsPageGroup = self.BBS.set_bbs_page_group(argument);
        callback(null,argument);
    };
    /**
     * todo : 设置默认地理位置
     * desc : 判断本地是否有地区 ? 获取本地地理位置 : 默认杭州 存放在本地key =  userLocation
     * tips : *缓存中的地理位置格式如下
     * @private
     */
    app.prototype._default_location = function () {
        var self = this;
        if(typeof localStorage.userLocation == typeof void 0) localStorage.userLocation = JSON.stringify({
            city : {
                city : '杭州',
                id : 87
            },
            zone : [
                {
                    zone : '上城区',
                    id : 844
                },
                {
                    zone : '下城区',
                    id : 845,
                },
                {
                    zone : '江干区',
                    id : 846
                },
                {
                    zone : '拱墅区',
                    id : 847,
                },
                {
                    zone : '西湖区',
                    id : 848
                },
                {
                    zone : '滨江区',
                    id : 849,
                },
                {
                    zone : '萧山区',
                    id : 850
                },
                {
                    zone : '余杭区',
                    id : 851,
                },
                {
                    zone : '桐庐县',
                    id : 852
                },
                {
                    zone : '淳安县',
                    id : 853,
                },
                {
                    zone : '建德市',
                    id : 854
                },
                {
                    zone : '富阳市',
                    id : 855,
                },
                {
                    zone : '临安市',
                    id : 856,
                }
            ],
            lon : '120.187777',
            lat : '30.286864'
        });
        self.userLocation = JSON.parse( localStorage.userLocation );
    };
    /**
     * todo : root 窗口加载动画
     * desc : open-load 打开加载窗口 close-load 关闭加载窗口
     * @private
     */
    app.prototype._load = function () {
        var self = this;
        $.api.listenerEvent('open-load' , function ( ret ) {
            api.openFrame({
                name: 'frame-load',
                url: 'widget://html/common/load.html',
                rect: $.extend({},{
                    y : 20,
                    x : 0,
                    width : 'auto',
                    height : 'auto'
                },typeof ret.rect == typeof void 0 ? {} : ret.rect ),
                pageParam: typeof ret.msg == typeof void 0 ? '加载中···' : ret.msg,
                bounces: false,
                bgColor: '#ededed',
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                animation:{
                    type : 'fade',
                    subType : 'from_right',
                    duration : 300
                }
            });
        });
        $.api.listenerEvent('close-load' , function () {
            api.setFrameAttr({
                name : 'frame-load',
                hidden : true
            });
        });
    };
    return $.home= function () {
        return new app();
    };
}();