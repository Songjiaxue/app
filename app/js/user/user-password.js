;~function () {

    var app = function () {
        this.$url = 'member/info/password';
        this.$codeUrl = 'common/code/tel';
        this.$code = $('[data-selector="code"]');
        this.$pwd = $('[data-selector="pwd"]');
        this.$submit = $('[data-selector="submit"]');
        this.SMS = $.smsCode();
        this.TOAST = $.toast();
    };

    app.prototype.init = function () {
        this._main();
    };

    app.prototype._main = function () {
        var self = this;
        self.SMS.$url = self.$codeUrl;
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
                self._ajax(cb)
            }
        ],function (err) {
            self.TOAST.load().hide();
            if(err) return $.api.toast( JSON.stringify( err['msg'] || err) ) ;
            self.TOAST.success();
        });
    };
    app.prototype._ajax = function (callback) {
        var self = this;
        var data = {
            code : self.$code.val(),
            password : self.$pwd.val(),
            repassword : self.$pwd.val(),
        };
        callback = $.callback( callback );
        if(data['code'].length != 6 || !data['password']) return callback('填写不完整');
        $.ajax({
            url : self.$url ,
            data : data
        }).then( callback );
    };
    return $.userPassWord = function () {
        return new app();
    };
}();