;~function(){

    var app = function () {
        this.id = api.pageParam.id;
    };

    app.prototype.init = function () {

    };
    
    return $.beautyHomeService = function(){
        return new app();
    };
}();