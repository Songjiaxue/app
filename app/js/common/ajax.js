/**
 * @$.ajax方法重写与jquery的ajax方法基本一致
 * @demo
 * $.ajax({
 *      url : string       *请求地址，必填,
 *      method : string    请求方式，默认post
 *      dataType : string  返回数据格式，默认json
 *      data : object      请求所携带参数，默认传递token,appid, deviceid
 *      cache : boolean    是否参与缓存，值当前缓存，而不是ajax自带缓存，ajax自带缓存，默认开启，且无法关闭
 *      timeout : number   请求过期事件 ，默认5秒
 *      //success : function 请求成功回调函数    已经删除 请使用then方法
 *      //error : function   请求失败的回调函数  已经删除 请使用then方法
 * });
 *
 * @缓存机制
 * 数据缓存至localStorage 健为 完整url + sign ，值为JSON字符串
 * 缓存有效期默认为3分钟
 * 在参数中设置cache为false , 则不加入缓存队列
 *
 * @加入了then方法
 * $.ajax(options).then(function(err,ret){});
 *
 */




;~function () {
    var app = function (opts) {
        this.host = 'http://api.mlb.kfw001.com/';
        this.key = '!@#kfwljwzhuchaofengyang20160802434';
        this.token = JSON.parse( localStorage.token ).token;
        this.cacheTime = 300;
        this.sign = '';
        this.settings = opts;
        this.settings.url = this.host + this.settings.url;
        this.callback = typeof callback == 'function' ? callback : function () {};
        !!opts.success || !!opts.error ? this.init() : null;
    };
    /**
     * 添加默认传参，并执行ajax
     */
    app.prototype.init = function () {
        var self = this;
        self.settings.data = $.extend( {}, self._default_data() , self.settings.data);
        self.ajax();
    };
    /**
     * 后执行函数
     * @param callback
     */
    app.prototype.then = function (callback) {
        var self = this;
        self.callback = callback;
        self.init();
    };
    /**
     * 返回默认传输参数
     * @returns {{}}
     */
    app.prototype._default_data = function () {
        var self = this;
        return {
            token : self.token,
            appid : typeof api === typeof void 0 ? 0 :  api.appId || 0 ,
            deviceid : typeof api === typeof void 0 ? 0 :  api.deviceId || 0
        };
    };
    /**
     * ajax 字典序参数
     * @returns {Array} 字典序的参数健值
     * @private
     */
    app.prototype._sort = function () {
        var self = this,
            sort = [];

        for (var key in self.settings.data){
            sort.push( key );
        };
        return sort.sort();
    };
    /**
     * 获得加密串
     * @returns {string}
     * @private
     */
    app.prototype._signature = function () {
        var self = this,
            signature = api.require('signature');
        self._sort().forEach(function (key) {
            self.sign += key + self.settings.data[key] + '&';
        });
        self.sign += self.key;
        self.sign = signature.md5Sync({
            data : self.sign
        });
        return self.sign;
    };
    /**
     * 返回完整的数据 可以直接放入datas
     * @private
     */
    app.prototype._data = function () {
        var self = this;
        self.settings.data = $.extend({} , self.settings.data , {
            sign : self._signature()
        });
        return self.settings.data;
    };
    /**
     * ajax方法集中处理
     * @returns {*}
     */
    app.prototype.ajax = function () {
        var self = this,
            opts = $.extend({} , {
                url : '',      //求情地址
                cache : false, //是否参与缓存[这里是指代我们自己写的本地缓存]
                method : 'POST', //传输方式
                dataType : 'JSON', //返回数据类型
                timeout : 5, //ajax请求过期时间
                success : function () {}, //成功回调函数
                error : function () {} //失败回调函数
            } , self.settings ),
            data = self._data(),
            cache = self.getCache();
        if(opts.cache &&　!!cache &&  cache.timestamp + self.cacheTime > self._timestamp() ) {
            self.callback( null , cache);
            return opts.success(cache);
        };
        api.ajax({
            url : opts.url,
            cache : true,
            method : opts.method,
            dataType : opts.dataType,
            timeout : opts.timeout,
            data : {
                values : data,
                files : opts.files
            }
        } , function ( ret , err ) {
            if(!!err) {
                err = {
                    status : 0 ,
                    msg : err.msg
                };
                self.callback(err);
                return opts.error(err);
            };
            if(ret.status != 200){
                err = {
                    status : ret.status ,
                    msg : ret.msg
                };
                self.callback(err);
                return opts.error(err);
            };
            ret = typeof ret.data == typeof void 0 ? typeof void 0 : ret.data;
            self.success(opts , ret);
        });
    };
    /**
     * ajax成功执行
     * @param opts 传入的参数
     * @param ret   获得的数据
     */
    app.prototype.success = function (opts , ret) {
        var self = this;
        //判断是否需要缓存
        if(opts.cache) self.setCache(ret);
        self.callback( null , ret);
        opts.success(ret);
    };
    /**
     * 设置缓存，在数据中加入当前时间戳，并根据接口地址与接口加密参数进行缓存
     * @param ret 缓存数据
     * @returns {boolean}
     */
    app.prototype.setCache = function (ret) {
        var self = this;
        if(typeof ret != 'object') return false;
        //添加当前时间戳
        ret = $.extend({} , ret ,{
            timestamp : self._timestamp()
        });
        ret = JSON.stringify(ret);
        return localStorage.setItem( self.settings.url + self.sign , ret);
    };
    /**
     * 获得当前ajax请求的缓存数据
     * @returns {boolean} 缓存存在返回缓存数据否则返回false
     */
    app.prototype.getCache = function () {
        var self = this,
            cache = localStorage.getItem( self.settings.url + self.sign  );
        return !!cache ? JSON.parse(cache) : false;
    };
    /**
     * 获得当前的unix 时间戳
     * @returns {number}
     * @private
     */
    app.prototype._timestamp = function () {
        return Math.round(new Date().getTime()/1000);
    };
    /**
     * $.ajax
     * @param opts
     * @returns {*}
     */
    $.ajax = function (opts) {
        if(typeof opts != 'object' || !opts.url ) return $.api.toast('参数错误：' + typeof void 0);
        return new app(opts);
    };
}();
