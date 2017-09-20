;~function () {
    var app = function () {
        this.$getCode = $('.weui-vcode-btn');
        this.$tel = $('input[name="tel"]');
        this.$url = 'common/code/sms';
        this.time = 60;
        this.init();
    };
    app.prototype.init = function () {
        var self = this;
        self._event();
    };
    /**
     *
     * @private
     */
    app.prototype._event = function () {
        var self = this;
        self.$getCode.on('tap' , function () {
            var $this = $(this);
            var tel = self.$tel.val() || '';
            var tip = $this.data('tip') || '';
            self._ajax(tel, tip, function (err , ret) {
                if(err) return $.api.toast('短信发送失败');
                $.api.toast('短信发送成功，请注意查收');
                self._loop($this);
            });
        });
    };
    app.prototype._loop = function ($this) {
        var self = this;
        $this.off('tap').text( self.time + '秒后重新获取');
        self.time -= 1;
        if( self.time <= 0) {
            $this.text('获取验证码');
            return self._event();
        };
        setTimeout(function () {
            self._loop($this);
        },1000);
    };
    app.prototype._ajax = function (tel , tip , callback) {
        var self = this,
            data={};
        !!tel ? data['tel'] = tel : null;
        !!tip ? data['tps'] = tip : null;
        $.ajax({
            url : self.$url,
            data : data
        }).then(callback);
    };
    return $.smsCode = function () {
        return new app();
    };
}();