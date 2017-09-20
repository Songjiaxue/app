;~function () {
    var app = function () {
        this.nav = $('.nav-item');
        this.title = $('[data-selector="title"]');
        //数据加载的选择器
        this.bbsPageGroup;
        //内容选择器
        //details
        this.detailsContext = $('[data-selector="details-context"]');
        this.assessContext = $('[data-selector="assess-context"]');
        this.emtionsBtn = $('[data-selector="emotions-btn"]');
        this.emtionsTarget = $('[data-selector="emtions-target"]');
        this.closeEdit = $('[data-selector="close-edit"]');
        this.sendEdit = $('[data-selector="send-edit"]');
        this.detailsEdit = $('[data-selector="details-edit"]');
        this.openEditBox = $('[data-selector="open-edit-box"]');
        //执行
        this.emtions();
    };
    app.prototype.init = function () {
        var self = this;
        async.waterfall([
            function (cb) {
                self.getArticleDetails(cb);
            },
            function (rs , cb) {
                self.htmlBbsDetails(rs , cb);
            }
        ],function (err,ret) {
            $.echo();
            if(err) return self.notFind();
            self.assessMain();
        });
    };
    /**
     * 根据不同入口进行不同的页面数据获取
     * */
    app.prototype.getArticleDetails = function ( callback ) {
        var id = api.pageParam.id;
        callback = $.callback(callback);
        if(typeof id == 'undefined') return callback('id不存在');
        $.ajax({
            url : api.pageParam.type == 'sit' ? 'bbs/topic/detail' : 'bbs/article/detail',
            data : api.pageParam.type == 'sit' ? {
                topic_id : id
            } : {
                article_id : id
            }
        }).then( callback );
    };
    /**
     * 返回html字符串
     * */
    app.prototype.returnArticleHtml = function ( db ) {
        var self = this,
            html = '';
        if(api.pageParam.type == 'sit'){
            html += '<div class="details-title"><div class="head" data-echo-background="';
            html += db.avatar || '../../images/img.png';
            html += '"></div><div class="nickname">';
            html += db.nick || '佚名';
            html += '</div></div>';
            if(typeof db.cover != 'undefined' ){
                html += '<div class="details-img"><div class="img-group"><div class="img-item" data-echo-background="';
                html += db.cover;
                html += '"></div></div>';
                if(typeof db.thumbs != 'undefined' && db.thumbs.length){
                    html += '<div class="img-more" data-event="openPhotoBrowser" data-params=\'{"images":[';
                    db.thumbs.forEach(function (thumb) {
                        html += '"';
                        html += thumb.path;
                        html += '",';
                    });
                    html += '"'+ db.cover +'"';
                    html +=']}\'><i class="icon-picture"></i><span>点击查看所有图片</span></div></div>';
                };
            };
            html += '<div class="details-desc">';
            html += db.content;
            html += '</div><div class="details-tools"><div class="details-tools-in"><div class="details-tools-left"><div class="details-tools-time">';
            html += db.ago || '冰河世纪';
            html += '</div><div class="details-tools-report">举报</div></div><div class="details-tools-right"><div class="details-tools-love"><span>(';
            html += db.good || 0;
            html += ')</span></div><div class="details-tools-share"><i class="icon-love"></i></div></div></div></div>';
        }else{
            html += '<div class="details-title"><div class="nickname">';
            html += db.title;
            html += '</div></div><div class="details-author"><div class="time">';
            html += '作者:';
            html += '</div><div class="name">';
            html += db.writer || '佚名';
            html += '</div></div><div class="details-img pr">';
            html += db.content;
            html += '</div><div class="details-tools"><div class="details-tools-in"><div class="details-tools-left"><div class="details-tools-time">';
            html += db.ago;
            html += '</div><div class="details-tools-report">举报</div></div><div class="details-tools-right"><div class="details-tools-love"><span>(';
            html += db.good;
            html += ')</span></div><div class="details-tools-share"><i class="icon-love"></i></div></div></div></div>';
        };
        return html;
    };
    /**
     * 覆盖html
     * */
    app.prototype.htmlBbsDetails = function ( ret , callback ) {
        var self = this;
        self.detailsContext.html( self.returnArticleHtml(ret) );
        callback(null,ret);
    };
    app.prototype.assessMain = function () {
        var self = this;
        $.api.scrolltobottom(false);
        //获取当前的评论数据
        async.waterfall([
            function (cb) {
                self.getAssessData(cb);
            },
            function (ret ,cb) {
                if(!(self.page - 1)) return self.htmlAssess(ret ,cb);
                self.appendAssess(ret ,cb);
            }
        ],function (err , ret) {
            $.echo();
            if( ret['count'] < self.size ) return self.appendNotFind();
            //监听滚动
            $.api.scrolltobottom( true , function () {
                self.page += 1;

                self.assessMain();
            })
        });
    };
    app.prototype.getAssessData = function (callback) {
        var self = this,
            id = api.pageParam.id;
        callback = $.callback(callback);
        $.ajax({
            url : api.pageParam.type == 'sit' ? 'bbs/topic/comment' : 'bbs/article/comment',
            data : api.pageParam.type == 'sit' ? {
                topic_id : id,
                page : self.page || 1
            } : {
                article_id : id,
                page : self.page || 1
            },
            cache : false

        }).then(callback);
    };
    app.prototype.htmlAssess = function (ret , callback) {
        var self = this;
        self.assessContext.html( self.assessItemHtml(ret) );
        callback(null,ret);
    };
    app.prototype.appendAssess = function (ret , callback) {
        var self = this;
        self.assessContext.append( self.assessItemHtml(ret) );
        callback(null,ret);
    };
    app.prototype.assessItemHtml = function (db) {
        var self = this;
        var html = '';
        db = db['info'] || [];
        db.forEach(function (item , i) {
            html += '<div class="details-assess-item"><div class="assess-title"><div class="head" data-echo-background="';
            html += item.avatar || '../../images/img.png';
            html += '"></div><div class="nickname">';
            html += item.nick;
            html += '</div><div class="report">投诉</div></div><div class="assess-desc">';
            html += item.content ? AnalyticEmotion(item.content) : item.content;
            html += '</div><div class="assess-time">';
            html += item.ago || '冰河世纪';
            html += '</div></div>';
        });
        if( typeof db  == 'undefined' || !db.length) {
            html = '<div class="details-assess-no"></div>';
        };
        return html;

    };
    app.prototype.appendNotFind = function ($p) {
        if(!$p)return this.load.html('后面没有了');
        this.load.html('<i class="icon-spin3 animate-spin"></i>');
    };
    app.prototype.notFind = function () {
        this._undefined.show();
    };
    app.prototype.emtions = function () {
        var self = this;
        //表情按钮
        self.emtionsBtn.SinaEmotion( self.emtionsTarget );
        //弹出输入狂
        self.openEditBox.on('tap' , function () {
            alert('openEditBox');
            self.edittarget();
        });
        self.closeEdit.on('tap', function () {
            self.edittarget();
        });
        self.sendEdit.on('tap', function () {
            self.sendTalk();
        });
    };
    app.prototype.edittarget = function () {
        var self = this;
        if(!self.detailsEdit.hasClass('show')) return self.detailsEdit.addClass('show');
        self.detailsEdit.removeClass('show');
    };
    app.prototype.sendTalk = function () {
        var self = this,
            $val = self.emtionsTarget.val(),
            id = api.pageParam.id;

        if(!$val) return $.alert('您没有输入任何内容');
        $.ajax({
            url : api.pageParam.type == 'sit' ? 'bbs/topic/talk' : 'bbs/article/talk',
            data : api.pageParam.type == 'sit' ? {
                topic_id : id,
                content : $val
            } : {
                article_id : id,
                content : $val
            },
            success : function (ret) {
                alert(ret.msg);
                self.edittarget();
            },
            error : function (err) {
                $.api.toast(err);
            }
        });
    };

    return $.bbsDetails = function () {
        return new app();
    }
}();