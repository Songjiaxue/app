;~function () {
    return $.ads = {

        html : function (ret) {
            if(typeof ret != 'object' || typeof ret.data == typeof void 0 || ret.data.info == typeof void 0) return '';
            var html = '',
                db = ret.data.info;
            html = '<div class="banner-warp js-slider swipe"><div class="banner-group swipe-wrap">';
            db.forEach(function (ads) {
                html += '<div class="banner-item" style="background-image: url(\'';
                html += ads.thumb;
                html += '\')" ></div>';
            });
            html += '</div></div>';
            return html;
        },
        plate_html : function (ret) {
            if(typeof ret != 'object' || typeof ret.data == typeof void 0 || ret.data.info == typeof void 0) return '';
            var html = '',
                db = ret.data.info;
            html = '<div class="brands-warp"><div class="brands-group">';
            db.forEach(function (ads , i) {
                if(i >= 3) return false;
                html += '<div class="brands-item" ><img src="../images/brand1.png" data-echo="';
                html += ads.thumb;
                html += '"/></div>';
            });
            html += '</div></div>';
            return html;
        },
        bill_html : function (ret) {
            if(typeof ret != 'object' || typeof ret.data == typeof void 0 || ret.data.info == typeof void 0) return '';
            var html = '',
                db = ret.data.info;
            html = '<div class="bill-warp"><div class="bill-group">';
            db.forEach(function (ads , i) {
                if(i >= 2) return false;
                html += '<div class="bill-item"><div class="bill-title">';
                html += ads.name;
                html += '</div><div class="bill-context"><img src="../images/home-index-bill-1.jpg" data-echo="';
                html += ads.thumb;
                html += '" /></div></div>';
            });
            html += '</div></div>';
            return html;
        }
    };
}();