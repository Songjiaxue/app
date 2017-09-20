;~function () {

    var app = function () {
        this.shop_id = api.pageParam.shop_id || typeof void 0;
        this.id = api.pageParam.id || typeof void 0;
        this.type = 1;
        this.number = 1;
        this.defaultAddressHtml = '';
        this.$address = $('[data-selector="address"]');
        this.$beauty = $('[data-selector="beauty"]');
        this.$changeNumber = $('[data-selector="change-number"]');
        this.$number = $('[data-selector="number"]');
        this.$price = $('[data-selector="all-price"]');
        this.$submit = $('[data-selector="submit"]');
    };

    app.prototype.init = function () {
        this.main();
    };
    /**
     * 主入口文件
     */
    app.prototype.main = function () {
        var self = this;
        async.waterfall([
            function(cb){
                self.ajax(cb)
            },
            function (ret , cb) {
                self.setHtml(ret , cb);
            },
            function (ret , cb) {
                self._event(ret , cb)
            }
        ],function(err,ret){
            $.echo();
            if(err) return $.api.toast(err);
        });
    };
    /**
     * todo : 设置页面的html
     * @param ret : object 请求获得的页面数据
     * @param callback : function 设置完成后的回调函数
     */
    app.prototype.setHtml = function (ret , callback) {
        var self = this;
        // 设置地址信息
        self.$address.html(self._defaultAddressHtml(ret));
        self.$beauty.html(self._storeInfoHtml(ret));
        callback( null , ret);
    };
    /**
     * todo : 设置默认的提货店铺地址
     * desc : 讲html存在this.defaultAddressHtml 中，以后切换使用
     * @param db ret.data
     * @returns {string} html string
     * @private
     */
    app.prototype._defaultAddressHtml = function (db) {
        var self = this,
            html = '';
        if( typeof db['shop'] == typeof void 0 ) return '';
        db = db['shop'];
        html += '<div class="beauty-address"><div class="info"><div class="nick">';
        html += db.name;
        html += '</div><div class="tel">';
        html += db['phone'];
        html += '</div></div><div class="address-info">';
        html += db.address;
        html += '</div></div>';
        html += '<div class="icon gt icon-gt"></div>';
        self.defaultAddressHtml = html;
        return html;
    };
    /**
     * todo : 设置商品的店铺，商品的信息html
     * @param db
     * @returns {string}
     * @private
     */
    app.prototype._storeInfoHtml = function (db) {
        var html = '';
        if(typeof db['shop'] === typeof void 0) return html;
        html += '<div class="title icon-gt"><div class="head" data-echo-background="';
        html += db['shop']['logo'];
        html += '"></div> <p>';
        html += db['shop'].name;
        html += '</p></div>';
        if( typeof db.goods == typeof void 0) return html;
        db.goods.forEach(function(goods){
            html += '<div class="context"><div class="head" data-echo-background="';
            html += goods['thumb'];
            html += '"></div><div class="info"><div class="info-title">';
            html += goods.title;
            html += '</div><div class="info-desc">无描述</div><div class="info-price">¥';
            html += goods['offer_money'];
            html += '</div></div></div>';
        });
        return html;
    };
    app.prototype._event = function( ret , callback ){
        var self = this;
        callback = $.callback(callback);
        /**
         * 更改数量
         */
        var maxNumber = parseInt( ret['goods'][0]['max_buy'] ),
            money = parseInt( ret['goods'][0]['offer_money'] );
        self.$price.html( '¥' + self.number * money );

        self.$changeNumber.on('tap' , function(){
            var f = $(this).data('params');
            if(f == 'less' && self.number > 0){
                self.number -= 1;
            };
            if(f == 'add' && self.number < maxNumber){
                self.number += 1;
            };
            self.$number.val( self.number );
            self.$price.html( '¥' + self.number * money );
        });
        self.$number.on('change' , function(){
            var $this = $(this);
            if($this.val() > maxNumber) self.number = maxNumber;
            $this.val(self.number);
            self.$price.html( '¥' + self.number * money );
        });
        self.$submit.on('tap' , function () {
            async.waterfall([
                function (cb) {
                    self.order_ajax(cb);
                }
            ],function (err,ret) {
                if(err) return $.api.toast(err);
                $.app.switch('openNewWin' , {
                    name : 'win_pay',
                    param : {
                        id : ret
                    }
                });
            });
        });
        callback();
    };
    /**
     * ajax请求
     * @param callback
     */
    app.prototype.ajax = function (callback) {
        var self = this;
        $.ajax({
            url : 'mall/order/cart',
            data : {
                shop_id : self.shop_id ,
                type : self.type,
                goods : '{"'+ self.id + '":"' + self.number +'"}'
            }
        }).then( callback ); 
    };
    app.prototype.order_ajax = function(callback){
        var self = this;
        var data = {
            shop_id : self.shop_id,
            type : 1,
            goods : '{"'+ self.id +'":"' + self.number + '"}'
        };
        $.ajax({
            url : 'mall/order/make',
            data : data,
            cache : false
        }).then(callback)
    };
    return $.goodsOrder = function () {
        return new app();
    };
}();