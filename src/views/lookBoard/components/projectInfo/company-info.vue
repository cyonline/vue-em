<template>
    <card class="project-situation" title="项目概况" @doMore="doMore">
        <template>
            <div class="container">
                <div class="top-item">
                    <div class="item-content">
                        <div style="width: 60%">
                            <div>项目总数（个）</div>
                            <div class="item_num">{{ProjectCount}}</div>
                        </div>
                        <div class="iocn-content">
                            <div class="img-box iocn-first"></div>
                        </div>
                    </div>
                </div>
                <hr>
                <div class="bottom-item">
                    <div class="item-content">
                        <div style="width: 70%">
                            <div>
                                <div>总建筑面积（m²）</div>
                                <div class="item_num">{{BuildingArea}}</div>
                            </div>
                        </div>
                        <div  class="iocn-content">
                            <div class="img-box iocn-second"></div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </card>  
</template>

<script>
import card from "@/views/lookBoard/components/common/card.vue"
export default {
    name:'project-info',
    data:function(){
        return{
            ProjectCount:0,
            BuildingArea:0,
        }
    },
    props:{
        // 层级(1.集团，2.公司，3.项目)
        hierarchyType: {
            type: Number|String,
            required: true,
            default: function () {
                return 1;
            },
        },
        structId: {
            type: String,
            required: false,
            default: function () {
                return '';
            },
        },
        data: {
            type:Object,
            required: true,
            default: function(){
                return {}
            }
        }
    },
    components:{
        'card':card
    },
    methods:{
        doMore:function(){
            console.info('more')
        },
        getData:function(){
            var _this = this;
            // $.request({
            //     url: "/api/engineeringReportBoard/projectCount",
            //     type: "get",
            //     isLoad: true,
            //     data:{
            //         hierarchyType:_this.hierarchyType,
            //         commonId:_this.structId,
            //     },
            //     success: function (data, res) {
            //         if (res.Code == 0) {
            //             _this.ProjectCount = data.ProjectCount;
            //             _this.BuildingArea = data.BuildingArea;
            //         }
            //     },
            // })
        }
    },
    created:function(){

    },
    mounted:function(){
        this.getData();
    },
    watch:{
        structId:function(n){
            this.getData();
        }
    }
}
</script>
<style>
    .company-situation .container{
        /* padding-left: 10px;
        margin-top: 10px; */
    }
    .item-content {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
    }
    .item_num{
        font-size: 18px;
        font-weight: bold;
        padding-top: 8px;
    }
    .iocn-content{
        width: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .iocn-first {
        /* background-image: url("../../../../../static/images/project.png"); */
        background-size: 35px 35px;
        background-repeat: no-repeat;
        background-position: center;
    }
    .img-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px; 
        height: 50px;
        border-radius: 8px;
        margin: 0 10px;
    }
    .iocn-second{
        /* background-image: url("../../../../../static/images/building-area.png"); */
        background-size: 40px 40px;
        background-repeat: no-repeat;
        background-position:center;
    }
</style>