<template>
    <div class="baidu-map">
        <div class="container" style="width: 100%; height: 100%;">
            <div id="map" style="width: 100%; height: 100%;"></div>
        </div>
    </div>
</template>

<script>
/* function ComplexCustomOverlay(point, infoArr) {
    this._point = point;
    // this._text = '';  
    this.infoArr = infoArr || [];     
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
} */

function addMarker (mp, point, index) {
    var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png",
    new BMap.Size(23, 25), {
        offset: new BMap.Size(10, 25),
        imageOffset: new BMap.Size(0, 0 - index * 25)
    });
    var marker = new BMap.Marker(point, {
        icon: myIcon
    });
    mp.addOverlay(marker);
    return marker;
}
function addInfoWindow (marker, info, hierarchyType) {
    var infoArr = [
        {key: '项目分期', value: info.StageNames.join(', ')},
        {key: '项目地址', value: info.ProjectAddress},
        {key: '总建筑面积', value: info.BuildingArea},
        {key: '用地面积', value: info.LandUseArea},
        {key: '开竣工日期', value: info.StrStartWorkDate+'~'+info.StrCompleteDate}
    ]
    if (hierarchyType == 2) {
        infoArr.splice(3, 1);
    }
    var html = [];
        html.push('<table cellspacing="0" class="pop-info-table"><tbody>');
        for(var i = 0; i < infoArr.length; i++) {
            html.push('<tr>');
            html.push('<td class="td-title">'+infoArr[i].key+'</td>');
            html.push('<td class="td-content">' + infoArr[i].value + ' </td>');
            html.push('</tr>');
        }
        html.push('</tbody></table>');
    var title = '<div class="pop-info-title">' + info.ProjectName + '</div>';
    var infoWindow = new BMap.InfoWindow(html.join(','), {
            title: title,
            width: 300
        });
     var openInfoWinFun = function() {
            marker.openInfoWindow(infoWindow);
        };
    marker.addEventListener("click", openInfoWinFun);
    return openInfoWinFun;
        
}

export default {
    data: function() {
        return {
            showMap: false,
            info: {},
            mapH: 0 
        }
    },
    props: {
        city: {
            type: Object,
        },
        // 层级(1.集团，2.公司，3.项目)
        hierarchyType: {
            type: Number,
            required: true,
            default: function () {
                return 0;
            },
        }
    },
    watch: {
        city: {
            handler: function() {
                this.getProjectData();
            },
            deep: true
        }
    },
    methods: {
        /**
         * 初始化地图
         * 
         * @param {Object} [point] 指定URL city: {lat: , lng: }
         */
        initMap: function(params, info) {
            var that = this;
            if(this.hierarchyType == 1){
                var city = {
                    lat: 39.915,
                    lng: 116.4035
                }
            }else {
                var city = {
                    lat: params.Latitude ? params.Latitude : 39.915,
                    lng: params.Longitude ? params.Longitude : 116.4035,
                }
            }
            var map = new BMap.Map("map");    // 创建Map实例
            var point = new BMap.Point(city.lng, city.lat);
            // var times = this.hierarchyType == 1 ? 5 : 12;
                // map.centerAndZoom(point, times);  // 初始化地图,设置中心点坐标和地图级别
                map.centerAndZoom(point, 6);
                map.setCenter(point);
                map.enableScrollWheelZoom(true);     // 开启鼠标滚轮缩放 
                map.addControl(new BMap.NavigationControl());
            var data = info.length > 0 ? info : [];
                data && data.forEach(function(item) {  
                    if(item.Longitude && item.Latitude){
                        /* map.addOverlay(
                            new ComplexCustomOverlay(new BMap.Point(item.Longitude, item.Latitude), 
                            item)
                        ); */
                         var marker = addMarker(map, new BMap.Point(item.Longitude, item.Latitude), 11);
                         addInfoWindow(marker, item, that.hierarchyType);
                    }          
                    
                })                          
        },
        getProjectData: function() {
            var self = this;
            var cityId = (this.city && this.city.Id) || '';
            $.request({
                url: '/project/projectMaps',
                type: 'GET',
                data: {
                    companyId:  cityId
                },
                loading: true,
                success: function(data, res) {
                    if (res.Code === 0) {
                        self.info = data || [];
                        self.init()
                    }
                },
                error: function(){
                }
            });
        },
        init: function() {
            this.initMap(this.city,this.info);
        }
    },
    mounted: function() {
        this.getProjectData();
    },
}
</script>

<style scoped>
.baidu-map {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  /* height: 100%; */
}
</style>
<style>
#map .arrow{
    transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    background: #1C7CEC;
    position: absolute;
    width: 10px;
    height: 10px;
    left: 25px;
    top: 10px;
    overflow: hidden;
}
#map .overlay{
    background-color: #1C7CEC;
    border-radius: 5px;
    color: white;
    height: 18px;
    padding: 2px;
    line-height: 18px;
    position: absolute;
    white-space: nowrap;
    -moz-user-select: none;
    font-size: 12px;
    line-height: 15px;
}
#map .anchorBL {
    display: none;
}
.BMap_cpyCtrl.BMap_noprint.anchorBL {
    display: none;
}

.pop-info-title {
    font-weight:bold;
    color:#CE5521;
    font-size:14px
}

table.pop-info-table {
    table-layout:fixed;
    width:100%;
    font:12px arial,simsun,sans-serif
}

table.pop-info-table .td-title {
    vertical-align:top;
    line-height:20px;
    width:80px;
    white-space:nowrap;
    word-break:keep-all
}

table.pop-info-table .td-content {
    vertical-align:top;
    line-height:20px
}

</style>
