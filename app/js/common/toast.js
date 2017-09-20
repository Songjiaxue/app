;~function () {

    var app = function () {
        this.$toast = $('._toast');
    };

    app.prototype.init = function () {

    };

    app.prototype.success = function () {
        var self = this,
            $this = self.$toast.find('#success');
        if( $this.hasClass('show') ) return false;
        $this.addClass('show');
        setTimeout(function () {
            $this.removeClass('show');
            $.app.switch('closeWin');
        },500);
    };

    app.prototype.load = function () {
        var self = this,
            $this = self.$toast.find('#load');
        return {
            show : function () {
                return $this.addClass('show');
            },
            hide : function () {
                return $this.removeClass('show');
            },
            Progress : function () {
                $this.removeClass('show');
                return self.$toast.siblings('._main').addClass('show');
            }
        }
    };
    return $.toast = function () {
        return new app();
    };
}();