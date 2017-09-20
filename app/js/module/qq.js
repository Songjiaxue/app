/**
 * qq SDK操作
 *
 */

;~function () {

    var app = function () {
        this.qq = api.require('qq');
        this.android = {
            id : '1105410509',
            key : '7ki84UhA5hYwkVLv'
        };
        this.ios = {
            id : '1105410523',
            key : '4CXeu1RlBP2R32kz'
        };
        this.info = {
            type : 1 ,
            auth_openid : '',
            auth_token : '',
            province : '',
            city : '',
            nick : '',
            sex : '',
            avatar : ''
        };
    };
    /**
     * 判断qq是否安装
     * @param callback : function 安装执行回调函数，否则不执行，并且弹出错误提示
     */
    app.prototype.install = function (callback) {
        var self = this;
        callback = typeof callback == 'function' ? callback : function () {};
        self.qq.installed(function(ret, err) {
            if (ret.status) {
                callback();
            } else {
                return $.api.toast('您未安装腾讯QQ');
            };
        });
    };
    /**
     * 调用qq登陆，并获取用户信息
     * @param callback : function [获取信息成功后执行，否则不执行，并且弹出错误提示];
     */
    app.prototype.login = function (callback) {
        var self = this;
        callback = typeof callback == 'function' ? callback : function () {};
        if(typeof self.qq == 'undefined') return $.api.toast('你忘了初始化');
        self.install(function () {
            self.get_user_info(callback);
        });
    };
    app.prototype.get_user_info = function (callback) {
        var self = this;
        var qq = api.require('qq');
        self.qq.login({
            apiKey : api.systemType == 'ios' ? self.ios.id : self.android.id
        },function(ret, err) {
            if(err) return $.api.toast(err);
            self.info.auth_openid = ret.openId;
            self.info.auth_token = ret.accessToken;
            self.get_details_info(callback);
        });
    };
    app.prototype.get_details_info = function (callback) {
        var self = this;
        self.qq.getUserInfo(function(ret, err) {
            if(err) return $.api.toast(err);
            self.info.nick = ret.info.nickname;
            self.info.avatar = ret.info.figureurl_qq_2;
            self.info.sex = ret.info.gender == '男' ? 1 : 2;
            self.info.province = ret.info.province;
            self.info.city = ret.info.city;
            callback(self.info);
        });
    };
    /**
     * 分享链接到qq的操作
     * @param param [object] 分享内容参数
     * @param callback [分享成功后的回调函数]
     * @returns {boolean} 如果参数报错，会有提示
     */
    app.prototype.shareUrl = function (param , callback) {
        var self = this;
        self.install(function () {
            self.qq.shareNews($.extend({},{
                //这里填写默认数据
                apiKey : api.systemType == 'ios' ? self.ios.id : self.android.id,
                url : 'https://baidu.com',
                title : '分享标题',
                description : '分享描述',
                imgUrl : 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1781221968,1734501883&fm=80',
                type : 'QFriend' || 'QZone'
            },param),function (ret,err) {
                callback();
            });
        });
    };
    app.prototype.shareUrlToQFriend = function (param , callback ) {
        var self = this;
        callback = typeof callback == 'function' ? callback : function () {};
        if(typeof self.qq == 'undefined') return $.api.toast('你忘了初始化');
        if(typeof param != 'object') return $.api.toast('您的参数不正确');
        param.type = 'QFriend';
        self.shareUrl(param , callback);
    };
    app.prototype.shareUrlToQZone = function (param , callback ) {
        var self = this;
        callback = typeof callback == 'function' ? callback : function () {};
        if(typeof self.qq == 'undefined') return $.api.toast('你忘了初始化');
        if(typeof param != 'object') return $.api.toast('您的参数不正确');
        param.type = 'QZone';
        self.shareUrl(param , callback);
    };
    return $.qq = function () {
        return new app();
    };
}();