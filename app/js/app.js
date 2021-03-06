(function () {
    var app = function () {};
    app.prototype.call = function ($p) {
        if(typeof $p.tel === typeof void 0 || !$p.tel) return $.api.toast('您拨打的电话是空号');
        $.confirm('是否拨打电话？', '确定致电： ' + $p.tel + ' ?' , function ($f) {
            if(!$f) return false;
            api.call({
                type: 'tel',
                number: $p.tel
            });
        });
    };
    app.prototype.removeLaunch = function () {
        api.removeLaunchView({
            animation: {
                type: 'fade',
                duration: 500
            }
        });

    };
    app.prototype.closeWin = function () {
        $.api.closeWin();
    };
    app.prototype.openShareAction = function () {
        //打开分享按钮窗口
        var action = $.shareAction();
        action.init().open(function (err , i , item) {
            if(err) return false;
            var qq = $.qq();
            qq.init();
            switch (i){
                case 2 :
                    qq.shareUrlToQFriend({},function () {
                        $.api.toast('分享成功');
                    });
                    break;
                case 3 :
                    qq.shareUrlToQZone({},function () {
                        $.api.toast('分享成功');
                    });
                    break;
                default:
                    $.api.toast('尚未完善，请期待下一个版本~~~');
            }
        });
    };
    app.prototype.openPhotoBrowser = function ($p) {
        var self = this,
        photoBrowser = api.require('photoBrowser');
        photoBrowser.open({
            images: $p.images,
            placeholderImg: 'widget://images/cover.jpg',
            bgColor: '#000'
        }, function(ret, err) {
            if($p.images.length <= ret.index + 1) {
                $.api.toast('1秒后自动关闭');
                setTimeout(function () {
                    photoBrowser.close();
                },1000)
                return false;
            };
        });
    };

    /**
     * @按钮事件
     * @param $e 事件名称
     * @param $p 事件传参
     * @param $this 事件主体
     */
    app.prototype.switch = function ($e,$p,$this) {
        var self = this;
        switch ($e){
            case 'call':
                //拨打电话
                self.call($p);
                break;
            case 'bbsSwitchGroup' :
                //论坛切换事件
                $.homeBbs().sendEvent($p || 0);
                break;
            case 'openNewWin':
                //打开新窗口
                $.openWin($p);
                break;
            case 'closeWin':
                //关闭窗口
                self.closeWin($p);
                break;
            case 'openShareAction':
                //打开分享按钮窗口
                self.openShareAction($p);
                break;
                //QQ授权登陆
            case 'qqLogin':
                $.userLogin().qqLogin();
                break;
                //发送验证码
            case 'sendSMSCode':
                $.userCommon().sendSMSCode($e,$p,$this);
                break;
                //打开图片浏览器
            case  'openPhotoBrowser':
                self.openPhotoBrowser($p);
                break;
                //删除积分订单
            case 'deleteOrder':
                $.coinOrder().delete($p);
                break;
            default:
                $.api.toast($e + '这个事件没有被定义');
                break;
        };
    };

    return $.app = new app();
}($ || ( $ = {} )));

