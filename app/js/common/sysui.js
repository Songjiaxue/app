/**
 * @定制系统弹出框
 * alert or confirm
 * @param title : string [弹出框显示的标题]
 * @param text : string [弹出窗的内容]
 * @param callback : function  [弹出窗点击后的回调函数] []
 * @param mark : boolean [callback所传的返回值，当为alert，一直返回true , confirm 确定返回true 取消返回false]
 * @return object [返回当前对象];
 *
 * */

;~function () {
    var app = function (title , text , callback , type) {
        this.$container;
        this.title = title;
        this.text = text;
        this.callback  = typeof callback == 'function' ? callback : function () {};
        this.type = type;
        this.init();
    };
    app.prototype.init = function () {
        var self = this;
        self.ceater();
        self.event();
    };
    app.prototype.html = function () {
        var self = this,
            html = '';
        html += '<div class="ui-alert show"><div class="ui-alert-wrap"></div><div class="ui-alert-toast"><div class="ui-alert-title"><div class="ui-alert-title-in">';
        html += self.title ||　'';
        html += '</div></div><div class="ui-alert-context"><div class="ui-alert-context-in">';
        html += self.text || '';
        html += '</div></div><div class="ui-alert-btn-group">';
        if(self.type == 'alert'){
            html += '<div class="ui-alert-btn" data-type="1">确认</div>';
        }else{
            html += '<div class="ui-alert-btn" data-type="0">取消</div><div class="ui-alert-btn" data-type="1">确认</div>';
        };
        html += '</div></div></div>';
        return html;
    };
    app.prototype.ceater = function () {
        var self = this;
        self.$container = document.createElement('div');
        self.$container.className = 'ui-container';
        self.$container.innerHTML = self.html();
        document.body.appendChild( self.$container );
    };
    app.prototype.event = function () {
        var self = this;
        var node = self.$container.querySelectorAll('.ui-alert-btn');

        for( var i = 0 ; i < node.length ; i++ ){
            node[i].addEventListener('click' , function(){
                var $this = this;
                self.hide(!!parseInt($this.getAttribute('data-type')));
            } , false );
        };

    };
    app.prototype.hide = function (flag) {
        var self = this;
        self.callback( flag );
        self.$container.parentNode.removeChild(self.$container);
    };
    $.alert = function (title , text , callback) {
        return new app(title , text , callback , 'alert');
    };
    $.confirm = function (title , text , callback) {
        return new app(title , text , callback , 'confirm');
    };
}();



;~function () {
    var app = function (options , callback) {
        this.container = '';
        this.$container = '';
        this.settings = $.extend({},{
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
        },options);
        this.settings.callback = callback;
        this.init();
    };

    app.prototype.init = function () {
        this.addHtml();
        this.event();
    };
    app.prototype.addHtml = function () {
        var self = this;
        self.container = document.createElement('div');
        var html = '';
        html += '<div class="_action-sheet"><div class="action-wrap" data-event="hide" data-params="false"></div><div class="action-sheet"><div class="action-sheet-title">';
        html += self.settings.title;
        html += '</div><div class="action-sheet-item-group">';
        self.settings.item.forEach(function (item,i) {
            html += '<div class="action-sheet-item';
            html += item.icon ? ' ' + item.icon : '';
            html += '" data-event="select" data-params="';
            html += i;
            html += '">';
            html += item.name;
            html += '</div>';
        });
        html += '</div></div></div>';
        self.container.innerHTML = html;
        document.body.appendChild(self.container);
        //初始化选择器
        self.$container = $(self.container).find('._action-sheet');
    };
    app.prototype.event = function () {
        var self = this;
        self.$container.on('tap' , '[data-event]' , function () {
            var $this = $(this),
                i = $this.data('params');
            self.hide();
            if($this.data('event') == 'hide') return self.settings.callback(false);
            self.settings.callback(self.settings.item[i]);
        });
    };
    app.prototype.show = function () {
        var self = this;
        self.$container.addClass('show');
    };
    app.prototype.hide = function ($f) {
        $f = $f ? $f: true;
        var self = this;
        if($f) return $(self.container).remove();
        self.$container.removeClass('show');
    };
    $.actionSheet = function (options , callback) {
        if(typeof options != 'object' || !options || !options.item.length) return false;
        callback = typeof callback == 'function' ? callback : function () {};
        return new app(options,callback);
    };
}();