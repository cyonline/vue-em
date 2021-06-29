(function(win, doc){
    var map;
    function float(n) {
        return parseFloat(n) || 0;
    }
    /**
     * 解释URL（？号后的）搜索字符串为对象
     * 
     * @param {string} [url] 指定URL
     */
    function urlSearch(url) {
        console.log(win.parent)
        var result = {};
        var set = (typeof url == 'string' ? url : doc.location.search).match(/\w+\=[^&|$]*/g);

        if (set != null) {
            set.forEach(function (description) {
                var d = description.match(/(\w+)\=(.*)/);

                d[2] = decodeURI(d[2]);
                result[d[1]] = /^\-?(\d*\.)?\d+(\e\-?\d+)?$/.test(d[2]) ? float(d[2]) : d[2];
            });
        }
        console.log(result)
        return result;
    }

    /**
     * 初始化地图
     * 
     * @param {Object} [point] 指定URL
     */
    function initMap(params) {
        var fn = {};
        var city = params.city ? JSON.parse(params.city) : {};
        map = new BMap.Map("map");    // 创建Map实例
            if(city.lng && city.lat){
                console.log(city.lng, city.lat)
                var point = new BMap.Point(city.lng, city.lat);
            }else {
                var point = new BMap.Point(116.4035, 39.915);
            }
            map.centerAndZoom(point, 5);  // 初始化地图,设置中心点坐标和地图级别

            map.enableScrollWheelZoom(true);     // 开启鼠标滚轮缩放
            map.enablePinchToZoom(true);         // 开启双指缩放                             
    }
    /**
     * 初始化标志物
     * 
     * @param {Array} [data] 指定URL
     */
    function ComplexCustomOverlay(point, text) {
        this._point = point;
        this._text = text;       
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function(map){
        this._mp = map;
        var div = this._div = document.createElement("div");
            div.className +=" overlay";
            div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        var span = this._span = document.createElement("span");
            span.appendChild(document.createTextNode(this._text));      

        var arrow = this._arrow = document.createElement("div");
            arrow.className +=" arrow";
            arrow.style.zIndex = BMap.Overlay.getZIndex(this._point.lat) - 1;
            div.appendChild(arrow);
            div.appendChild(span);

            map.getPanes().labelPane.appendChild(div); // 在地图上添加元素

        return div;
    }
    ComplexCustomOverlay.prototype.draw = function(){
        var mp = this._mp;
        var pixel = mp.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - 25 + "px";
        this._div.style.top  = pixel.y - 28 + "px";
    }
    
	/**
     * 绘制标志物
     * 
     * @param {Array} [data] 指定URL
     */
    function infoWin(data) {
        var data = data ? JSON.parse(data) : [];
        data && data.forEach(function(item) {            
            map.addOverlay(
                new ComplexCustomOverlay(new BMap.Point(item.lng, item.lat), 
                item.text)
            );
        })      
    }

    function init() {
        var params = urlSearch();
            initMap(params);
            infoWin(params.data)
    }

    return init()
})(window, document)