

;(function(){

    var app = function () {
        this.id = api.pageParam['id'];
        this.$radio = $('input[type="radio"]');
        this.$info = $('[data-selector="info"]');
        this.$pay = $('[data-selector="pay"]');
        this.pay_type = 1;
        this.aliPay = api.require('aliPay');
    };

    app.prototype.init = function () {
        this.main();
    };
    /**
     * todo : 主程序
     * desc : 请求订单信息，添加选择支付方式和支付事件
     */
    app.prototype.main = function () {
        var self = this;
        alert(JSON.stringify(self.id));
        async.waterfall([
            function (cb) {
               self.ajax(cb);
            },
            function (ret , cb) {
                self.appendHtml(ret , cb);
            },
            function (ret , cb) {
                self.event(cb);
            }
        ],function (err,ret) {
            $.echo();
            if(err) return $.api.toast(err);
        });
    };
    /**
     * todo ；
     * @param callback
     */
    app.prototype.ajax = function (callback) {
        var self = this;
        $.ajax({
            url : 'mall/order/confirm' ,
            data : {
                order_id : self.id
            }
        }).then(callback);
    };
    app.prototype.appendHtml = function (ret , callback) {
        var self = this;
        callback( null , self.$info.html( self.html(ret) ));
    };
    app.prototype.html = function (db) {
        var html = '';
        if(typeof db != 'object') return html;
        html += '<div class="head" data-echo-background="';
        html += db['logo'];
        html += '"></div><div class="info"><div class="info-in"><div class="money">应付款：<span>¥';
        html += db['offer_money'] || '出现错误';
        html += '</span></div><div class="code">订单编号：';
        html += db['order_sn'] || '00000000000000000000';
        html += '</div></div> </div>';
        return html;
    };
    app.prototype.event = function (callback) {
        var self = this;
        self.$radio.on('change', function () {
            var $this = $(this);
            self.pay_type = parseInt($this.val());
            $('.radio').removeClass('active');
            $this.parent().addClass('active');
        });
        self.$pay.on('tap' , function(){ self._pay();});
        callback();
    };
    app.prototype._pay = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self.ajax_pay(cb);
            },
            function (ret , cb) {
                switch (self.pay_type){
                    case 1 :
                        self.aliPayOrder(ret ,cb);
                        break;
                    default :
                        cb('暂未实现');
                };
            }
        ],function(err,ret){
            if(err) return $.api.toast(err);
            alert(JSON.stringify(ret));
        });
    };
    app.prototype.ajax_pay = function (callback) {
        var self = this;
        $.ajax({
            url : 'mall/pay/start',
            data : {
                order_id : self.id,
                pay_type : self.pay_type
            }
        }).then(callback);
    };
    app.prototype.aliPayOrder = function (ret , callback) {
        var self = this;
        self.aliPay.payOrder({
            orderInfo : ret
        }, function(ret, err) {
            callback(err , ret);
        });
    };
    return $.pay = function () {
        return new app();
    };
})();