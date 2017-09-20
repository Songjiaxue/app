
;~function () {

    var app = function (callback) {
        this.MNActionButton;
        this.items = [{
            icon: 'widget://res/share/wx-1.png',
            title: '微信朋友圈'
        }, {
            icon: 'widget://res/share/wx-2.png',
            title: '发送给朋友'
        }, {
            icon: 'widget://res/share/qq-1.png',
            title: 'QQ好友'
        }, {
            icon: 'widget://res/share/qq-2.png',
            title: 'QQ空间'
        }, {
            icon: 'widget://res/share/weibo.png',
            title: '新浪微博'
        }, {
            icon: 'widget://res/share/qrcode.png',
            highlight: 'widget://res/MNActionButton/5.png',
            title: '二维码'
        }, {
            icon: 'widget://res/share/link.png',
            highlight: 'widget://res/MNActionButton/6.png',
            title: '复制链接'
        }];
        this.callback
    };
    app.prototype.init = function () {
        this.MNActionButton = api.require('MNActionButton');
        return this;
    };
    app.prototype.open = function (callback) {
        var self = this;
        self.callback = typeof callback == 'function' ? callback : function () {};
        self.MNActionButton.open({
            layout: {
                row: 2,
                col: 4,
                offset: 0,
                colSpacing : api.systemType == 'ios' ? 30 : 10
            },
            animation: false,
            autoHide: true,
            styles: {
                maskBg: 'rgba(0,0,0,.35)',
                bg: '#fff',
                cancelButton: {
                    bg: '#fff',
                },
                item: {
                    titleColor: '#888',
                    titleHighlight: 'dd2727',
                    titleSize: 12
                },
                indicator: {
                    color: '#c4c4c4',
                    highlight: '#9e9e9e'
                }
            },
            items: self.items
        }, function(ret) {
            if(ret.eventType == 'cancel') return self.callback(true);
            self.callback(null , ret.index , self.items[ret.index]);
        });
    };
    $.shareAction = function () {
        return new app();
    };
}();