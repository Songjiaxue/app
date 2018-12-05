/**
 * @入口文件集合
 * @监听了所有含有data-event的HTMLElement
 * @再次之前回执行userinfo.js 
 * */

;(function () {
    var app = function () {
        //监听所有的按钮
        this.$container = $('.js-container');
        this.$container.on('tap', '[data-event]' ,function () {
            var $this = $(this),
                $e = $this.data('event'),
                $p = $this.data('params') || false;
            $.app.switch( $e ,$p , $this);
        });
    };
    app.prototype.success = function () {
        //获取当前入口函数，并执行init函数
        var obj = $[fn]();
        obj.init();
    };
    app.prototype.error = function () {
        //入口未定义时执行，线上时删除
        $.api.toast('入口函数$.'+fn+'不存在');
    };
   /* /!* root 入口 *!/
    app.prototype.home = function () {
        var home = $.home();
        home.init();
    };
    /!* 首页主页 入口 *!/
    app.prototype.homeIndex = function () {
        $.homeIndex();
    };
    /!* 首页积分商城入口 *!/
    app.prototype.homeCoin = function () {
        $.app.swipe();
    };

    /!* 热点首页入口 *!/
    app.prototype.homeBbs = function () {
        var bbs = $.bbs();
        bbs.init();
    };
    /!* 官方论坛列表页面 *!/
    app.prototype.bbsOfficialLists = function () {
        //传入参数id
        $.bbs().official();
    };
    /!* 姐妹说论坛列表页面 *!/
    app.prototype.bbsOtherLists = function () {
        //传入参数id
        $.bbs().sitMain();
    };
    /!* 帖子详情入口 *!/
    app.prototype.bbsDetailsMain = function () {
        $.bbs().detailsMain();
    };*/
    var main = new app();
    var fn = $('body').data('main');
    return $.main = function () {
        return typeof $[fn] == 'function' ? main.success() : main.error();
    };
}());
