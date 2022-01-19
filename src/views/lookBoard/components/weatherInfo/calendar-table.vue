<template>
    <div class="calendar">
        <div class="calendar-title"></div>
        <!-- <div class="calendar-table"> -->
            <table class="calendar-table">
                <thead>
                    <tr>
                        <td v-for="item in dayText" :key="item">{{item}}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(weekData,index) in tableData" :key="index">
                        <td v-for="(dayData,index2) in weekData" :key="index2">
                            <span class="day" :class="{
                                'pass':dayData.month!=month || ((dayData.month==month)&&dayData.date<today),
                                'today':(today==dayData.date)&&(dayData.month==month)
                            }">{{dayData.date}}</span>
                            <span class="mark" :class="markClass[dayData.weather]"></span>
                        </td>
                    </tr>
                </tbody>
            </table>
        <!-- </div> -->
    </div>
</template>
<script>
import Calendar from "@/views/lookBoard/components/common/calendar.js"
export default {
    name:'calendarTable',
    data:function(){
        return {
                title: '日历',
                dateArr: [],
                calendarList:[],
                dayText:['日','一','二','三','四','五','六'],
                tableData:[],
                markClass:{
                    1:'sun',
                    2:'rain',
                    3:'cloudy',
                },
                today: new Date().getDate()
        }
    },
    props:{
        year:{
            type:Number,
            required:false,
        },
        month:{
            type:Number,
            required:false,
        },
        date: {
            type:Number,
            required:false,
        },
        weatherData:{
            type:Array,
            required:false,
            default:function(){
                return []
            }
        }
    },
    methods: {
        init:function(){
            // console.info(this.year,this.month);
            var calendar = new Calendar(this.year,this.month,this.date);
            var list = calendar.init();
            // console.info('天气数据',this.weatherData)
            var dayIndex = 0; // 当月首日序号
            list.forEach(function(ele){
                if(ele.month == this.month){
                    ele['weather']=this.weatherData[dayIndex];
                    dayIndex++;
                }
            },this)
            this.tableData = calendar.createTableData(list);
            // console.info(this.tableData);
        }
        
    },
    mounted:function(){
        this.init()
    },
    watch:{
        weatherData:function(n,o){
            this.init();
        }
    },    
    components:{

    },
    
}
</script>
<style scoped>

    .calendar-table{
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        max-width: 100%;
        /* margin-bottom: 20px;
        border: 1px solid #ddd;
        background-color: transparent; */
    }
    .calendar-table tr{}
    .calendar-table tr td{
        text-align: center;
        padding: 0px;
        line-height: 1.42857143;
        vertical-align: top;
        cursor: default;
        
    }
    .calendar-table thead{
        padding: 8px 0;
    }
    .calendar-table thead tr{
        height: 30px;
        font-weight: 600;
        color: #C2C2C2;
    }
    .calendar-table tr .day{
        display: inline-block;
        width: 100%;
    }
    .calendar-table tr .mark{
        display: inline-block;
        width: 100%;
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
    .pass{
        color: #C2C2C2;
    }
    .today{
        color:#fff;
        background:#388D91;
    }
    .sun{
        background:#EB3D00
    }
    .cloudy{
        background: #0173B1;
    }
    .rain{
        background: #24211C;
    }
    
</style>