;~function () {

    var app = function () {
        this.token = JSON.parse( localStorage['token'] );
        this.$url = 'widget://html/address/address-item.html';
    };

    app.prototype.init = function () {
        var self = this;
        self._open();
    };

    app.prototype._open = function () {
        var self = this;
        if( !self.token['login'] )  self.$url = 'widget://html/common/not-login.html';
        api.openFrame({
            name: 'frame-address-item',
            url: self.$url ,
            rect: {
                marginTop : 65 ,
                marginBottom : 0,
                marginLeft : 0,
                marginRight : 0
            },
            bounces: true,
            bgColor: '#ededed',
            vScrollBarEnabled: false,
            hScrollBarEnabled: false
        });
    };

    return $.address = function () {
        return new app();
    };
}();