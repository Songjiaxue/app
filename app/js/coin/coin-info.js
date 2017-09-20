


;~function () {

    var app = function () {
        this.token = JSON.parse( localStorage['token'] );
        this.$item = $('[data-selector="nav-item"]');
        this.$bar = $('[data-selector="bar"]');
    };
    app.prototype.init = function () {
        var self = this;
        self._event();
        if( self.token['login'] ) return self.openFrameGroup();
        self._open_login();
    };
    app.prototype.openFrameGroup = function () {
        var self = this;
        api.openFrameGroup({
            name: 'coin-info-group',
            background: '#f2f2f2',
            scrollEnabled: true,
            rect: {
                x: 0,
                y: 105,
                w: 'auto',
                h: 'auto'
            },
            index: 0,
            frames: [{
                name: 'coin_info_group_in',
                url: 'widget://html/coin/coin-info-item.html',
                bgColor: '#f2f2f2',
                customRefreshHeader: 'UIPullRefresh',
                bounces: true,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                pageParam:{
                    type : '-1'
                }
            }, {
                name: 'coin_info_group_out',
                url: 'widget://html/coin/coin-info-item.html',
                bgColor: '#f2f2f2',
                customRefreshHeader: 'UIPullRefresh',
                bounces: true,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                pageParam:{
                    type : '1'
                }
            }]
        }, function(ret, err) {
            if(err) return false;
            self._changeBar(ret.index);
        });
    };
    app.prototype._event = function () {
        var self = this;
        self.$item.on('tap' , function () {
            var i = $(this).index();
            $.api.switchPageIndex('coin-info-group' , i , true);
        });
    };
    app.prototype._open_login = function () {
        api.openFrame({
            name: 'frame_login',
            url: 'widget://html/common/not-login.html',
            rect: {
                x: 0,
                y: 65
            },
            vScrollBarEnabled: false,
            hScrollBarEnabled: false
        });
    };
    app.prototype._changeBar = function (i) {
        var self = this;
        self.$bar.css({
            left : i * 50 + '%'
        });
    };
    return $.coinInfo = function () {
        return new app();
    };
}();