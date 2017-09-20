
;~function () {
    var app = function () {
        this.$data = api.pageParam;
        this.$url = 'mall/shop/detail';
        this.$html = $('[data-selector="html-content"]');
    };
    app.prototype.init = function () {
        var self = this;
        self._main();
    };
    app.prototype._main = function () {
        var self = this;
        async.waterfall([
            function ( cb ) {
                self._ajax(cb);
            },
            function (ret , cb) {
                self._append_html(ret , cb);
            }
        ],function (err,ret) {
            $.echo();
            if(err) $.api.toast(err);
        });
    };
    app.prototype._append_html = function (ret , callback) {
        var self = this,
            html = '';
        html += self._info_html(ret);
        html += self._staff_html(ret);
        html += self._brand_html(ret);
        callback(null,self.$html.html( html ) );
    };
    app.prototype._info_html = function (ret) {
        var html = '';
        if( !ret['shop'] ) return html;
        html += '<div class="main-item"><div class="title">联系我们 </div><div class="info">';
        if( !!ret['shop']['phone'] ){
            html += '<p><span>客服电话：';
            html += ret['shop']['phone'];
            html += '</span><span data-event="call" data-params=\'{"tel" :"';
            html += ret['shop']['phone'];
            html += '"}\'>立即拨打&gt;&gt;</span></p>';
        };
        if( !!ret['shop']['address'] ) {
            html += '<p><span>详细地址：';
            html += ret['shop']['address'];
            html += '</span><span data-event="openNewWin" data-params=\'{"name":"win_map","param":{"lon":"';
            html += ret['shop']['longitude'];
            html += '","lat":"';
            html += ret['shop']['latitude'];
            html += '"}}\'>导航前往&gt;&gt;</span></p>';
        };
        html += '</div></div>';
        if(!!ret['shop']['info']) return html;
        html += '<div class="main-item"><div class="title">商家介绍 </div><div class="content">';
        html += ret['shop']['info'];
        html += '</div></div>';
        return html;
    };
    app.prototype._staff_html = function (ret) {
        var self = this,
            html = '';
        if( !ret['staff'] || !ret['staff'].length ) return html;
        html += ' <div class="main-item"><div class="title">美容师 </div><div class="content">';
        ret['staff'].forEach(function (staff, i) {
            if(i >= 3) return false;
            html += ' <div class="content-item"><div class="content-item-in" data-echo-background="';
            html += staff['thumb'];
            html += '"></div></div>'
        });
        html += '</div></div>';
        return html;
    };
    app.prototype._brand_html = function(ret){
        var self = this,
            html = '';
        if( !ret['brand'] || !ret['brand'].length ) return html;
        html += ' <div class="main-item"><div class="title">品牌推荐 </div><div class="content">';
        ret['brand'].forEach(function (brand, i) {
            if(i >= 3) return false;
            html += ' <div class="content-item"><div class="content-item-in" data-echo-background="';
            html += brand['thumb'];
            html += '"></div></div>'
        });
        html += '</div></div>';
        return html;
    };
    app.prototype._ajax = function (callback) {
        var self = this;
        $.ajax({
            url : self.$url ,
            data : {
                shop_id : self.$data['id']
            }
        }).then(callback);
    };
    return $.storeIntroduction = function () {
        return new app();
    };
}();