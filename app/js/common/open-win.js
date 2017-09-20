;~function () {

    var app = function (options) {
        this.token = JSON.parse( localStorage.token );
        this.name = options.name;
        this.param = options.param;
        this.url = options.url;
        this.animation = {
            type:"push",
            subType: "from_right",
            duration: 250
        }
    };
    /**
     * 公共open
     */
    app.prototype.open = function () {
        var self = this;
        api.openWin({
            name : self.name ,
            url: self.url ,
            animation : self.animation,
            pageParam : self.param ,
            vScrollBarEnabled: false,
            hScrollBarEnabled: false
        });
    };
    /**
     * 打开起始页
     */
    app.prototype.win_welcome = function () {
        var self = this;
        self.animation = {
            type : 'fade',
            subType : 'from_right',
            duration : 300
        };
        self.url = 'widget://html/common/welcome.html';
        self.open();
    };
    /**
     * todo : 打开积分收支明细
     */
    app.prototype.win_coin_info = function () {
        var self = this;
        self.url = 'widget://html/coin/coin-info.html';
        self.open();
    };

    /**
     * 打开用户登陆页面
     */
    app.prototype.win_user_login = function () {
        var self = this;
        self.url = 'widget://html/user/user-login.html';
        self.open();
    };
    /**
     * 打开积分商城商品信息详情页
     */
    app.prototype.win_cargo_coin = function () {
        var self = this;
        self.url = 'widget://html/cargo/cargo-coin.html';
        self.open();
    };
    /**
     * 打开注册页面
     */
    app.prototype.win_user_register = function () {
        var self = this;
        self.url = 'widget://html/user/user-register.html';
        self.open();
    };
    /**
     * 修改密码
     */
    app.prototype.win_user_password = function () {
        var self = this;
        self.url = 'widget://html/user/user-password.html';
        self.open();
    };
    /**
     * bbs美丽说详情页
     */
    app.prototype.win_bbs_details = function () {
        var self = this;
        self.url = 'widget://html/bbs/bbs-details.html';
        self.open();
    };
    /**
     * 打开店铺首页
     */
    app.prototype.win_store_home = function () {
        var self = this;
        self.url = 'widget://html/store/store-home.html';
        self.open();
    };
    app.prototype.win_assess = function () {
        var self = this;
        self.url = 'widget://html/assess/assess.html';
        self.open();
    };
    /**
     * 打开商品详细页
     */
    app.prototype.win_cargo_goods = function () {
        var self = this;
        self.url = 'widget://html/cargo/cargo-goods.html';
        self.open();
    };
    /**
     * 商品订单生成页面
     */
    app.prototype.win_goods_order = function () {
        var self = this;
        if(!self.token.login ) return self.win_user_login();
        self.url = 'widget://html/order/goods-order.html';
        self.open();
    };
    /**
     * 打开积分订单生成页面
     */
    app.prototype.win_coin_order = function () {
        var self = this;
        if(!self.token.login ) return self.win_user_login();
        self.url = 'widget://html/order/coin-order.html';
        self.open();
    };
    /**
     * 支付订单页面
     */
    app.prototype.win_pay = function () {
        var self = this;
        self.url = 'widget://html/pay/pay.html';
        self.open();
    };
    app.prototype.win_coin_pay = function () {
        var self = this;
        self.url = 'widget://html/pay/coin-pay.html';
        self.open();
    };
    /*
    * todo : set start
    * */
    /**
     * todo : 打开设置主页
     * desc : 1. 个人信息设置
     *        2. 意见反馈
     *        3. 检查更新
     *        4. 关于美乐吧
     *        5. 登陆或者登出按钮
     */
    app.prototype.win_set_index = function () {
        var self = this;
        self.url = 'widget://html/set/set-index.html';
        self.open();
    };
    /**
     * todo : 打开个人信息设置列表
     */
    app.prototype.win_set_user = function () {
        var self = this;
        self.url = 'widget://html/set/set-user.html';
        if(!self.token.login ) self.url = 'widget://html/common/nothings.html';

        self.open();
    };
    /**
     * 设置性别
     */
    app.prototype.win_set_sex = function () {
        var self = this;
        self.url = 'widget://html/set/set-sex.html';
        self.open();
    };
    app.prototype.win_set_nick = function () {
        var self = this;
        self.url = 'widget://html/set/set-nick.html';
        self.open();
    };
    app.prototype.win_set_tel = function () {
        var self = this;
        self.url = 'widget://html/set/set-tel.html';
        self.open();
    };
    app.prototype.win_set_avatar = function () {
        var self = this;
        self.url = 'widget://html/set/set-avatar.html';
        self.open();
    };
    app.prototype.win_address = function () {
        var self = this;
        self.url = 'widget://html/address/address.html';
        self.open();
    };

    /**
     * todo : set end
     */


    $.openWin = function ($p) {
        if(typeof $p != 'object' || !$p) return $.api.toast('尚未开发，请耐心等候');
        if($p.name == 'root') return api.openWin({
            name : 'root'
        });
        var apk = new app($p);
        typeof apk[$p.name] == 'function' ? apk[$p.name]() : $.api.toast($p.name + ' is ' + typeof void 0);
    };
}();
