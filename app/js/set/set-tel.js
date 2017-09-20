;~function () {

    var app = function () {
        this.$old = $('[data-selector="old-tel"]');
        this.$tel = $('[data-selector="tel"]');
        this.$code = $('[data-selector="code"]');
        this.$submit = $('[data-selector="submit"]');
        this.SMS = $.smsCode();
        this.TOAST = $.toast();
        this.$url = 'member/info/tel';
    };

    app.prototype.init = function () {
        this._main();
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
        ],function (err) {
            self.TOAST.load().hide();
            if(err) return $.api.toast(err['msg'] || err);
            self._send();
            self.TOAST.success();
        })
    };
    app.prototype._send = function () {
        $.api.sendEvent('-event-refresh-set-user' , {});
    };
    app.prototype._ajax = function (callback) {
        var self = this;
        var data = {
            old_tel : self.$old.val() ,
            tel : self.$tel.val(),
            code : self.$code.val()
        };
        if( data['old_tel'].length != 11 || data['tel'].length != 11 || !data['code']) return callback('请仔细填写');
        $.ajax({
            url : self.$url,
            data : data
        }).then( callback );
    };

    return $.setTel = function () {
        return new app();
    };
}();