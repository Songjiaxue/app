;~function () {

    var app = function () {
        this.$sex = $('[data-selector="sex"]');
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
        self.$sex.on('tap' , function () {
            var $this = $(this),
                i = $this.data('sex');
            self._one(i);
        });
    };
    app.prototype._one = function (i) {
        var self = this;
        self.TOAST.load().show();
        async.waterfall([
            function (cb) {
                self._ajax(i,cb);
            }
        ],function (err,ret) {
            self.TOAST.load().hide();
            if(err) return $.api.toast( JSON.stringify( err['msg'] || err ));
            self._send();
            self.TOAST.success();
        });
    };
    app.prototype._send = function () {
        $.api.sendEvent('-event-refresh-set-user' , {});
    };
    app.prototype._ajax = function (i,callback) {
        var self = this;
        callback = $.callback( callback );
        $.ajax({
            url : self.$url,
            data :{
                sex : i
            }
        }).then( callback );
    };

    return $.setSex = function () {
        return new app();
    };
}();