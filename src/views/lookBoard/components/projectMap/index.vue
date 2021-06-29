 <template>
   <div class="wrapper">
    <div v-pic-view :data-src="data.ImageUrl" class="display__inline_block">
      <img v-show="projectHasImage" class="" :src="data.ImageUrl" alt="项目户型图" />
      <div
        @click="handlePointClick(data)"
        v-if="data.AxisData"
        class="position_container"
        v-for="(data,$index) in pointData"
        :key="$index"
        :style="('left: ' + data.AxisData.x + 'px;top: ' + data.AxisData.y + 'px;')">
        <span class="location_icon1 position">{{ data.idx }}</span>
        <div class="position_header">
          <span :title="data.BuildName" class="position_header_left">{{ data.BuildName }}</span>
        </div>
      </div>
    </div>
   </div>
 </template>
 
 <script>
 import PicView from '/pages/directives/pic-view/index.js';

 export default {
   name: 'ProjectMap',
   props: ['structId', 'value'],
   directives: {
     'pic-view': PicView,
   },
   data: function () {
     return {
       data: {},
       pointData: [],
       projectHasImage: false,
     };
   },
   watch: {
     structId: function () {
       this.fetchData();
     },  
   },
   created: function () {
     if (this.structId) {
       this.fetchData();
     }
   },
   methods: {
     fetchData: function () {
       var vm = this;
       return this.$$get('/project/buildAndtProjectDrawing', {
         projectId: this.structId,
       }).then(function (res) {
         var data = res.data;
         vm.projectHasImage = !!data.ImageUrl;
        var points = [];
        (data.buildingInfoList || []).forEach(function (building, buildingIdx) {
          building.idx = buildingIdx + 1;
          building.hasPoint = false;
          var o = {
            BuildId: building.BuildId,
            idx: building.idx,
            BuildName: building.BuildName,
            AxisData: null,
          };
          (data.pointInfoList || []).some(function (point) {
            if (point.BuildId === building.BuildId) {
              o.AxisData = point.AxisData ? JSON.parse(point.AxisData) : null;
              building.hasPoint = !!point.AxisData;
              return true;
            }
            return false;
          });
          points.push(o);
        });
        //
        vm.pointData = points;
        vm.data = data;
       });
     },
     handlePointClick: function (data) {
       this.$emit('input', data.BuildId);
     },
   },
 };

 </script>
 
 <style scoped>
 .display__inline_block {
   display: inline-block;
 }
 .position_relative {
   position: relative;
 }
 .wrapper {
   position: relative;
 }
 .position_container{
  position: absolute;
  background: rgba(0,0,0,0);
  font-size: 12px;
  cursor: pointer;
  z-index:10;
}
.position{
  position: absolute;
}

/****悬浮框标题样式*/
.position_header{
  margin-left:25px;
  margin-top:2px;
  width:auto;
  height:28px;
  z-index:100;
  background: url("../../../../static/images/position_bg.png") no-repeat 0 0;
}
.position_header .iconfont{
  line-height: 34px;
  font-size: 18px;
  margin-right: 5px;
  color: #fff;
  opacity: 0.7;
}
.position_header .iconfont:hover{
  opacity:1;
}
.position_header_left{
  max-width:100px;
  color:#fff;
  padding-left: 15px;
  padding-right: 5px;
  line-height: 28px;
  float: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.position_header_right{
  float: left;
  width:auto;
  height:28px;
  background: #fff;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border:1px solid #f54343;
}


/*右边快速定位样式*/
.location{
  width: 180px;
  max-height: 80%;
  position:absolute;
  top:40px;
  left:25px;
  z-index:200;
}
.location_header{
  color: #fff;
  width: 100%;
  height: 30px;
  background-color: rgba(232,55,59,0.7);
  border-radius: 3px 3px 0 0;
  text-align: center;
}
.location_header span{
  line-height: 30px;
  padding-right:20px;
  background: url("../../../../static/images/icon4.png") no-repeat right 3px;
}
.location_icon1{
  display: inline-block;
  width: 22px;
  height:30px;
  text-align: center;
  line-height: 24px;
  color:#e80a0f;
  background: url("../../../../static/images/list_icon1.png") no-repeat center center;
}
 </style>
 