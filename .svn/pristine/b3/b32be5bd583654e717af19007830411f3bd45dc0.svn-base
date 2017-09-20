;~function () {
    var app = function () {
        this.tel = $('[data-selector="tel"]');
    };
    /**
     * 发送短信
     * @param $e
     * @param param
     * @param $this
     * @returns {boolean}
     */
    app.prototype.sendSMSCode = function ( $e , param , $this) {
        var self = this;
        var $tel = self.tel.val(),
            $time = 60,
            $timer = null;
        if(!$tel) return $.api.toast('手机号填写不正确');
        $.ajax({
            url : 'common/code/sms',
            data : {
                tel : $tel,
                tip : param.tip
            },
            success : function () {
                $.api.toast('短信发送成功，请注意查收');
                $this.data('event','').addClass('active');
                $timer = setInterval(function () {
                    $time -= 1;
                    if($time <= 0) {
                        clearInterval($timer);
                        $this.removeClass('active').html('点击发送');
                        return false;
                    };
                    $this.html($time + '秒后重新发送');
                },1000);
            },
            error : function (err) {
                $.api.toast('短信发送失败：'+ err);
            }
        });
    };
    
    $.userCommon = function () {
        return new app();  
    };
}();