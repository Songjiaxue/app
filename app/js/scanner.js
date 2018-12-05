

;~function () {
    var app = function () {
        this.FNScanner = api.require('FNScanner');//二维码扫描模块
        this.w = (document.body.clientWidth-200)/2;
    };
    app.prototype.init = function () {
        var self = this;
        self.openView();
    };
    app.prototype.openView = function () {
        var self = this;
        self.FNScanner.openView({
            autorotation: true
        }, function(ret, err) {
            if (ret.content) {
                window.location.href = ret.content;
                self.FNScanner.closeView();
            }
            else {
                var delay = setTimeout("alert('扫描失败！')",20000);
            }
        });
    };
    app.prototype.setFrame = function () {
        var self = this;
        self.FNScanner.setFrame({
            x: self.w,
            y: 200,
            w: 200,
            h: 200
        });
    };
    /*app.prototype.switchLight = function ($p,$this) {
     var self = this;
     var eq = $p;
     var $self = $this;
     };*/
    return $.scanner = function () {
        return new app();
    };
}();
