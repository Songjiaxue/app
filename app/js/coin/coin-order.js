;~function () {

    var app = function () {
        this.token = JSON.parse( localStorage['token'] );
    };

    app.prototype.init = function () {
        var self = this;
        if( self.token['login'] ) return self._open_frame();
        self._open_login();
    };
    app.prototype._open_frame = function () {
        api.openFrame({
            name: 'frame_coin_order-item',
            url: 'widget://html/coin/coin-order-item.html',
            rect: {
                x: 0 ,
                y: 65
            },
            vScrollBarEnabled: false,
            hScrollBarEnabled: false
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
    /*return $.coinOrder = function () {
        return new app();
    };*/
}();