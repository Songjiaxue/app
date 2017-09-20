;~function () {

    var app = function () {
        this.resource = 'http://api.mlb.kfw001.com/city.json';
        this.UICityList = api.require('UICityList');
        this.currentCity = JSON.parse(localStorage.city);
    };

    app.prototype.init = function () {
        var self = this;
        self.main();
    };
    app.prototype.main = function () {
        var self = this;
        self.UICityList.open({
            rect: {
                x: 0,
                y: 45 + $.api.statusSize()
            },
            resource: self.resource,
            styles: {
                searchBar: {
                    bgColor: '#696969',
                    cancelColor: '#E3E3E3'
                },
                location: {
                    color: '#696969',
                    size: 12
                },
                sectionTitle: {
                    bgColor: '#eee',
                    color: '#000',
                    size: 12
                },
                item: {
                    bgColor: '#fff',
                    activeBgColor: '#696969',
                    color: '#000',
                    size: 14,
                    height: 40
                },
                indicator: {
                    bgColor: '#fff',
                    color: '#696969'
                }
            },
            currentCity: typeof self.currentCity == 'object' ? self.currentCity.city.city : '未知',
            locationWay: '当前位置',
            hotTitle: '热门城市',
            placeholder: '输入城市名或首字母查询'
        }, function(ret, err) {

        });
    };
    return $.cityLists = function () {
        return new app();
    };
}();