;~function () {

    var app = function () {
        this.$data = api.pageParam;
        this.$FNImageClip = api.require('FNImageClip');
        this.$imageUrl = 'common/upload/image';
        this.$url = 'member/info/modify';
        this.$submit = $('[data-selector="submit"]');
    };

    app.prototype.init = function () {
        var self = this;
        self._main();
    };
    app.prototype._main = function () {
        var self = this;
        self._open();
        self._event();
    };
    app.prototype._open = function () {
        var self = this;
        self.$FNImageClip.open({
            rect: {
                x: 0,
                y: 65,
                w: api.winWidth,
                h: api.winHeight
            },
            srcPath: self.$data['src'],
            style: {
                mask: 'rgba(0,0,0,.5)',
                clip: {
                    w: 300,
                    x: ( api.winWidth - 300 ) / 2,
                    y: ( api.winHeight - 300 ) / 2,
                    appearance: 'circular',
                    borderColor : '#ffffff',
                    borderWidth: 1
                }
            },
            mode : 'image'
        });
    };
    app.prototype._event = function () {
        var self = this;
        self.$submit.on('tap' , function () {
            self._upload();
        });
    };
    app.prototype._upload = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self._save(cb);
            },
            function (ret , cb) {
                self._upload_image(ret , cb);
            },
            function (ret , cb) {
                self._ajax(ret,cb);
            }
        ],function ( err ) {
            if(!!err) return $.api.toast( JSON.stringify( err['msg'] || err ));
            self._send();

        });
    };
    app.prototype._send = function () {
        $.api.sendEvent('-event-refresh-set-user' , {});
        alert('上传成功');
        setTimeout(function () {
            $.app.closeWin();
        },500);
    };
    app.prototype._save = function (callback) {
        var self = this;
        self.$FNImageClip.save({
            destPath: 'fs://meileba/imageClip/avatar.jpg',
            quality: 1
        }, function( ret , err) {
            callback( err , ret);
        });
    };
    app.prototype._upload_image = function ( ret , callback) {
        var self = this;
        if( !ret['destPath'] || typeof ret['destPath'] == typeof void 0) return callback('文件保存失败');
        $.ajax({
            url : self.$imageUrl ,
            files : {
                image : ret['destPath']
            }
        }).then( callback );
    };

    app.prototype._ajax = function ( ret , callback) {
        var self = this;
        callback = $.callback( callback );
        $.ajax({
            url : self.$url ,
            data : {
                avatar : ret[0]['path']
            }
        }).then( callback )
    };
    return $.setAvatar = function () {
        return new app();
    };
}();