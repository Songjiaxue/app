/**
 * Created by Administrator on 2016/8/23.
 */
;~function () {
    $.echo = function ( callback ) {
        callback = typeof callback == 'function' ? callback : function () {};
        if( typeof echo != 'object') return false;
        echo.detach();
        echo.init({
            offset: 500,    //在屏幕意外多少像素的图片进行加载
            throttle: 250,  //加载演示时间
            unload: false, // 是否离开后卸载
            debounce : true, //是否进行函数节流
            callback: callback
        });
        echo.render();
    };
}();