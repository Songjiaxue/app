;~function () {

    var app = function () {
        this.$bbsGroup = api.pageParam;
        this.$nav = $('[data-selector="nav"]');
    };
    app.prototype.init = function () {
        var self = this;
        self._event();
    };
    app.prototype._event = function () {
        var self = this;
        self.$nav.on('tap'  , function () {
            var $this = $(this),
                i = $this.index(),
                $siblings = $this.siblings('');
            self._switch_icon($this , i , $siblings);
        });
    };
    app.prototype._switch_icon = function ($this , i , $siblings) {
        var self = this;
        if($this.hasClass('active')) return false;
        $this.addClass('active').find('.icon').addClass($this.data('active-icon')).removeClass($this.data('icon'));
        $siblings.removeClass('active');
        $siblings.forEach(function (siblings) {
            var $t = $(siblings);
            $t.find('.icon').addClass($t.data('icon')).removeClass($t.data('active-icon'));
        });
        $.api.switchPageIndex('home-page-group' , i);
        self._switch_page(i);
    };
    app.prototype._switch_page = function (i) {
        var self = this;
        self._hide_home_page();
        switch (i){
            case 1 :
                // 积分商城主页
                self._open_coin_home();
                break;
            case 2 :
                // 美容院列表
                self._open_store_lists();
                break;
            case 3 :
                // 热点组
                self._open_bbs_home();
                break;
            default :
                break;
        };
    };
    app.prototype._open_bbs_home = function () {
        var self = this;
        api.openFrameGroup({
            name: 'home-bbs-group',
            background: '#ededed',
            scrollEnabled: true,
            rect: {
                marginLeft : 0,
                marginTop : 110,
                marginBottom : 45,
                marginRight : 0
            },
            index: 0,
            frames: self.$bbsGroup
        }, function(ret, err) {
            $.api.sendEvent('_event_switch_home_bbs_group', {
                index : ret.index
            });
        });
    };
    app.prototype._open_coin_home = function () {
        var self = this;
        api.openFrame({
            name: 'coin_home',
            url: 'widget://html/coin/coin-index.html',
            rect: {
                marginLeft : 0,
                marginTop : 65,
                marginBottom : 45,
                marginRight : 0
            },
            bounces: false,
            bgColor: '#ededed',
            vScrollBarEnabled: false,
            hScrollBarEnabled: false
        });
    };
    app.prototype._open_store_lists = function () {
        var self = this;
        api.openFrame({
            name: 'store_lists',
            url: 'widget://html/store/store-lists.html',
            rect: {
                marginLeft : 0,
                marginTop : 100,
                marginBottom : 45,
                marginRight : 0
            },
            bounces: false,
            bgColor: '#ededed',
            vScrollBarEnabled: false,
            hScrollBarEnabled: false
        });
    };
    app.prototype._hide_home_page = function () {
        api.setFrameAttr({
            name: 'coin_home',
            hidden : true
        });
        api.setFrameGroupAttr({
            name: 'home-bbs-group',
            hidden: true
        });
        api.setFrameAttr({
            name: 'store_lists',
            hidden : true
        });
    };
    return $.homeFooter = function () {
        return new app();
    };
}();