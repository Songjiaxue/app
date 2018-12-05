;~function () {

    var app = function () {
        this.$url = 'member/info/user';
        this.$avatar = $('[data-selector="avatar"]');
        this.$nick = $('[data-selector="nick"]');
        this.$sex = $('[data-selector="sex"]');
        this.$tel = $('[data-selector="tel"]');
        this.$birth = $('[data-selector="birth"]');
        this.$actionSheet = {};
    };

    app.prototype.init = function () {
        this._main();
        this._refresh();
    };
    /**
     * todo : _main 函数
     * desc : 1. ajax请求数据
     *        2. 设置用户信息
     * @private
     */
    app.prototype._main = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self._ajax(cb)
            },
            function (ret , cb) {
                self._set_html(ret , cb);
            }
        ],function (err,ret) {
            if(err) return;
            self._event();
        });
    };
    app.prototype._event = function () {
        var self = this;
        self.$avatar.off('tap').on('tap' , function () {
            self._action_sheet();
        });
    };

    app.prototype._set_html = function (ret , callback) {
        var self = this;
        callback = $.callback(callback);
        ret['avatar'] ? self.$avatar.find('.content').css('background-image' , 'url("'+ ret['avatar']  +'")') : null;
        ret['nick'] ?  self.$nick.find('.content').text( ret['nick'] ) : null;
        self.$sex.find('.content').text( !parseInt(ret['sex']) ? '保密' : parseInt(ret['sex']) == 1 ? '男' : '女' );
        ret['tel'] ?  self.$tel.find('.content').text( ret['tel'] ) : null;
        ret['birth'] ?  self.$birth.find('.content').text( ret['birth'] ) : null;
        callback(null,ret);
    };
    app.prototype._refresh = function () {
        var self = this;
        $.api.listenerEvent('-event-refresh-set-user' , function () {
            self._main();
        });
    };
    /**
     * todo : ajax请求数据
     * @param callback
     * @private
     */
    app.prototype._ajax = function (callback) {
        callback = $.callback( callback );
        var self = this;
        $.ajax({
            url : self.$url
        }).then(callback);
    };
    /**
     *
     */
    app.prototype._action_sheet = function () {
        var self = this;
        self.$actionSheet = $.actionSheet({
            title : '更改头像',
            item : [
                {
                    icon : 'icon-picture',
                    name : '图片库',
                    value : 'library'
                },
                {
                    icon : 'icon-camera',
                    name : '相机',
                    value : 'camera'
                }
            ]
        },function (ret) {
            if(!ret) return;
            self._get_img(ret);
        }).show();
    };
    app.prototype._get_img = function (ret) {
        var self = this;
        api.getPicture({
            sourceType: ret['value'] || 'camera',
            encodingType: 'jpg',
            mediaValue: 'pic',
            destinationType: 'url',
            allowEdit: false,
            quality: 100,
            saveToPhotoAlbum: true
        }, function(ret, err) {
            if(!ret || !ret['data'] || err) return $.api.toast(err || '出现错误');
            $.app.switch('openNewWin' , {
                name : 'win_set_avatar',
                param : {
                    src : ret['data']
                }
            });
        });
    };
    return $.setUser = function () {
        return new app();
    };
}();