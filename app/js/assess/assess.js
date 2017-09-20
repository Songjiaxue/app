;~function () {

    var app = function () {
        this.id = api.pageParam.id;
        this.$item = $('[data-selector="nav-item"]');
    };
    app.prototype.init = function () {
        var self = this;
        self.openFrameGroup();
        self.event();
    };
    app.prototype.event = function () {
        var self = this;
        self.$item.on('tap' , function () {
            var i = $(this).index();
            $.api.switchPageIndex( 'coin-assess-group' , i , true);
        });
    };
    app.prototype.changeItem = function (i) {
        var self = this;
        self.$item.eq(i).addClass('active').siblings('').removeClass('active');
    };
    app.prototype.openFrameGroup = function () {
        var self = this;
        api.openFrameGroup({
            name: 'coin-assess-group',
            background: '#f2f2f2',
            scrollEnabled: true,
            rect: {
                x: 0,
                y: 110
            },
            index: 0,
            frames: [{
                name: 'coin-assess-group-1',
                url: 'widget://html/assess/assess-item.html',
                bgColor: '#ededed',
                customRefreshHeader: 'UIPullRefresh',
                bounces: true,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                pageParam : {
                    type : 0,
                    id : self.id
                }
            }, {
                name: 'coin-assess-group-2',
                url: 'widget://html/assess/assess-item.html',
                bgColor: '#ededed',
                customRefreshHeader: 'UIPullRefresh',
                bounces: true,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                pageParam : {
                    type : 1,
                    id : self.id
                }
            },{
                name: 'coin-assess-group-1',
                url: 'widget://html/assess/assess-item.html',
                bgColor: '#ededed',
                customRefreshHeader: 'UIPullRefresh',
                bounces: true,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                pageParam : {
                    type : 2,
                    id : self.id
                }
            }, {
                name: 'coin-assess-group-2',
                url: 'widget://html/assess/assess-item.html',
                bgColor: '#ededed',
                customRefreshHeader: 'UIPullRefresh',
                bounces: true,
                vScrollBarEnabled: false,
                hScrollBarEnabled: false,
                pageParam : {
                    type : 3,
                    id : self.id
                }
            }]
        }, function(ret, err) {
            if(err) return false;
            self.changeItem(ret.index);
        });
    };
    return $.assess = function () {
        return new app();
    };
}();