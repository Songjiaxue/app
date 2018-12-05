;~function () {

    var app = function () {
        this.$submit = $('[data-selector="submit"]');
        this.$nick = $('[data-selector="nick"]');
        this.TOAST = $.toast();
        this.$url = 'member/info/modify';
    };

    app.prototype.init = function () {
        var self = this;
        self._main();
    };

    app.prototype._main = function () {
        var self = this;
        self._event();
    };

    app.prototype._event = function () {
        var self = this;
        self.$submit.on('tap' , function () {
            self._one();
        });
    };
    app.prototype._one = function () {
        var self = this;
        self.TOAST.load().show();
        async.waterfall([
            function (cb) {
                self._ajax(cb);
            }
        ],function (err,ret) {
            self.TOAST.load().hide();
            if(err) return $.api.toast(err['msg'] || err);
            self._send();
            self.TOAST.success();
        });
    };
    app.prototype._send = function () {
        $.api.sendEvent('-event-refresh-set-user' , {});
    };
    app.prototype._ajax = function (callback) {
        var self = this,
            nick = self.$nick.val();
        callback = $.callback( callback );
        if(!nick) return callback('昵称未填写');
        $.ajax({
            url : self.$url,
            data :{
                nick : nick
            }
        }).then( callback );
    };

    return $.setNick = function () {
        return new app();
    };
}();