<template>
    
    <card class="weather" title="天气概况" @do-more="doMore">
        <div slot="right-title" >更多></div>
        <div class="weather-info">
            <div class="weather-item" v-for="(item,index) in weatherInfo" :key="index">
                <div>{{item.Week}}</div>
                <div><img :src="weatherImg[item.WeatherType-1]" alt=""></div>
                <div>{{item.Temp}}</div>
                <div>{{item.DayWeather}}</div>
                <div>风力{{item.DayPower}}</div>
            </div>
        </div>
        <div class="weather-calendar">
            <div class="header">
                <div class="title">{{month}}月晴雨表</div>
                <div class="mark">
                    <span class="mark-item"><i class="sun"></i>晴天</span>
                    <span class="mark-item"><i class="cloundy"></i>阴天</span>
                    <span class="mark-item"><i class="rain"></i>雨天</span>
                </div>
            </div>
            <calendar-table :weather-data="weatherData" :year="year" :month="month"></calendar-table>
        </div>
        <el-dialog  :visible.sync="dialogVisible" :show-close="false">
            
            <!-- <div class="show-data-box" > -->
                <div class="calendar-dialog">
                    <div slot="title" >
                        <div class="header">
                            <div class="mark">
                                <span class="mark-item"><i class="sun"></i>晴天</span>
                                <span class="mark-item"><i class="cloundy"></i>阴天</span>
                                <span class="mark-item"><i class="rain"></i>雨天</span>
                            </div>
                            <div class="select-month">
                                <span class="left-arrow" @click="preMonth"><i class="iconfont icon-arrow-down"></i></span>
                                <span class="text">{{dialogParams.year}}年{{dialogParams.month}}月</span>
                                <span class="right-arrow" @click="nextMonth"><i class="iconfont icon-arrow-down"></i></span>
                            </div>
                            <div class="close" @click="closeDialog"><i class="iconfont icon-close1"></i></div>
                        </div>
                    </div>
                    <div class="body">
                        <calendar-table-dialog :weather-data="dialogParams.weatherData" :year="dialogParams.year" :month="dialogParams.month"></calendar-table-dialog>
                    </div>
                    <div class="footer">
                        <span class="closeBtn" @click="closeDialog">关闭</span>
                    </div>
                <!-- </div> -->
            </div>
        </el-dialog>
    </card>
    
</template>
<script>
import card from "@/views/lookBoard/components/common/card.vue"
import calendarTable from '@/views/lookBoard/components/weatherInfo/calendar-table.vue'
import calendarTableDialog from '@/views/lookBoard/components/weatherInfo/calendar-table-dialog.vue'

export default {
    name: 'weather',
    components:{
        'card':card,
        'calendarTable':calendarTable,
        'calendarTableDialog':calendarTableDialog,
    },
    props:{
        data1:{
            type:Array,
            require:true,
            default:function(){
                return []
            }
        },
        data2:{
            type:Array,
            require:true,
            default:function(){
                return []
            }
        },
        structId:{
            type:String,
            require:false,
            default:function(){
                return ''
            }
        }
    },
    data:function(){
        return {
            weatherImg:[
                require('../../../../assets/images/tq_1.png'),
                require('../../../../assets/images/tq_3.png'),
                require('../../../../assets/images/tq_2.png'),
            ],
            weatherInfo:[],
            weatherData:[],
            cityId:'',
            year:new Date().getFullYear(),
            month:new Date().getMonth()+1,
            today: new Date().getDay(),
            layerIndex:0,
            dialogParams:{
                year:new Date().getFullYear(),
                month:new Date().getMonth()+1,
                weatherData:[],
            },
            dialogVisible:false,
        }
    },
    methods:{
        doMore:function(){
            this.dialogVisible = true;
            // this.layerIndex = layer.open({
            //     type: 1,
            //     title: '',
            //     shade: 0,
            //     area: ['600px', '500px'],
            //     resize: false,
            //     closeBtn:0,
            //     content: $('.show-data-box'),
            //     cancel: function () {
            //         //右上角关闭回调
                    
            //     }
            // });
        },
        closeDialog:function(){
            this.dialogVisible = false;
            // layer.close(this.layerIndex)
        },
        preMonth:function(){
            if(this.dialogParams.month==1){
                this.dialogParams.year--;
                this.dialogParams.month=12;
            }else{
                this.dialogParams.month--;
            }
            this.dialogParams.weatherData = [];
            this.getWeahterData();
        },
        nextMonth:function(){
            if(this.dialogParams.month==12){
                this.dialogParams.year++;
                this.dialogParams.month=1;
            }else{
                this.dialogParams.month++;
            }
            this.dialogParams.weatherData = [];
            this.getWeahterData();
        },
        getWeahterData:function(){
            var _this = this;
            // $.request({
            //     url: "/api/engineeringReportBoard/projectWeather",
            //     type: "get",
            //     isLoad: true,
            //     data:{
            //         stageId:_this.structId,
            //         cityCode:'',
            //         dt: _this.dialogParams.year+'-'+_this.dialogParams.month,
            //     },
            //     success: function (data, res) {
            //         if (res.Code == 0) {
            //             console.info('天气数据',data)
            //             _this.dialogParams.weatherData = data||[];
            //         }
            //     },
            // })
        }
    },
    created:function() {
        
    },
    mounted:function() {
        var today = new Date().getDay()
            this.weatherInfo = this.data1.map(function(ele){
                var weekArr = ['周一','周二','周三','周四','周五','周六','周日']
                return {
                    DayPower:ele.DayPower,
                    DayWeather:ele.DayWeather,
                    Temp:ele.Temp,
                    WeatherType:ele.WeatherType,
                    Week: ele.Week == today? '今天':weekArr[ele.Week-1]
                }
            }).slice(0,3);
            this.weatherData = this.data2||[];
            this.dialogParams.weatherData = this.data2||[];
    },
    watch:{
        data1:function(n){
            console.info('天气',n)
            var today = new Date().getDay()
            this.weatherInfo = n.map(function(ele){
                var weekArr = ['周一','周二','周三','周四','周五','周六','周日']
                return {
                    DayPower:ele.DayPower,
                    DayWeather:ele.DayWeather,
                    Temp:ele.Temp,
                    WeatherType:ele.WeatherType,
                    Week: ele.Week == today? '今天':weekArr[ele.Week-1]
                }
            }).slice(0,3);
        },
        data2:function(n){
            this.weatherData = n||[];
            this.dialogParams.weatherData = n||[];
        }
    }
}
</script>
<style scoped>
    .weather-info{
        height: 150px;
        overflow: hidden;
    }
    .weather-item{
        width: 33.33%;
        float: left;
        text-align: center;
        position: relative;
    }
    .weather-item::after{
        position: absolute;
        top:0px;
        right:0px;
        content:'';
        border-right:1px solid #eee;
        height: 80%;
    }
    .weather-item:last-child::after{
        border:0;
    }
    .weather-item>div{
        margin-bottom: 5px;
    }
    .weather-item img{
        width: 60%;
        max-width: 60px;
        margin-bottom: -10px;
    }
    .weather-calendar .header{
        overflow: hidden;
        height: 30px;
        line-height: 25px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 5px;
    }
    .weather-calendar .header .title{
        float: left;
        font-weight: bold;
    }
    .weather-calendar .header .mark{
        float: right;
    }
    .header .mark .mark-item{
        position: relative;
        margin-right: 5px;
    }
    .header .mark .mark-item i{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right:3px;
    }
    .sun{
        background:#EB3D00
    }
    .cloundy{
        background: #0173B1;
    }
    .rain{
        background: #24211C;
    }
    .calendar-dialog{
        width:100%;
        height: 100%;
        /* padding: 15px; */
    }
    .calendar-dialog .header{
        position: relative;
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        margin-bottom: 10px;
    }
    .calendar-dialog .header .mark{
        position: absolute;
        left:0;
        top:0;
    }
    .calendar-dialog .header .close{
        position: absolute;
        right:0;
        top:0;
        width: 30px;
        height:30px;
        line-height: 25px;
        cursor: pointer;
    }

    .calendar-dialog .header .select-month{
        position: absolute;
        left:50%;
        top:0;
        transform: translateX(-50%)
    }
    .select-month .text{
        margin:0 20px;
        font-weight: bold;
    }
    .left-arrow{
        display: inline-block;
        transform: rotate(90deg);
        cursor: pointer;
    }
    .right-arrow{
        display: inline-block;
        transform: rotate(-90deg)  translateX(1px);
        cursor: pointer;
    }
    
    .calendar-dialog .footer{
        width:100%;
        height: 60px;
        margin-top:15px;
        text-align: center;
    }
    .calendar-dialog .footer .closeBtn{
        display: inline-block;
        width: 100px;
        height: 40px;
        padding: 10px;
        text-align: center;
        border:1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
    }

    /* .el-dialog__header{
        padding: 0;
    } */
</style>