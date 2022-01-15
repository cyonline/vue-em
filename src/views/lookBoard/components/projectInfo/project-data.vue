<template>
    <card class="project-data" title="项目资料" @do-more="doMore">
        <template>
            <div slot="right-title">更多</div>
            <div class="container">
               <div class="pro-item">
                   <div class="icon-box month"></div>
                   <div class="data-box">
                        <span class="title">本月新增数</span>
                        <span class="number">{{proData.AddMonthCount}}</span>
                   </div>
               </div>
               <div class="pro-item">
                   <div class="icon-box"><div class="icon-img"></div></div>
                   <div class="data-box">
                        <span class="title">累计新增数</span>
                        <span class="number">{{proData.AdditionsCount}}</span>
                   </div>
               </div>
            </div>
        </template>
    </card>  
</template>

<script>
import card from "@/views/lookBoard/components/common/card.vue"
export default {
    name: 'project-data',
    data: function() {
        return {
            proData: {
                AddMonthCount: 0,
                AdditionsCount: 0
            },
        }
    },
    props:{
        // 层级(1.集团，2.公司，3.项目)
        hierarchyType: {
            type: Number|String,
            required: true,
            default: function () {
                return 0;
            },
        },
        structId: {
            type: String,
            required: false,
            default: function () {
                return '';
            },
        },
    },
    components:{
        'card':card
    },
    watch: {
        hierarchyType: function () {
            this.fetchData();
        },
        structId: function () {
            this.fetchData();
        },
    },
    methods:{
        doMore:function(){
            console.info('more')
            // 
            var content = '/web/em/dataManagement.html?layer=1&stageId=' + this.structId
                layer.open({
                    type: 2,
                    title: ["文档"],
                    shade: 0.001,
                    area: ['100%', '100%'],
                    resize: false,
                    content: content
                });
        },
        fetchData: function () {
            var vm = this;
            var subData = {
                hierarchyType: this.hierarchyType,
                commonId: this.structId, // 下拉选择项(公司Id或项目Id)
            };
            // this.$$get('/api/engineeringReportBoard/dataManageFile', subData)
            // .then(function (res) {
            //     if (res.data) {
            //         vm.proData = res.data
            //     } else {
            //         vm.proData = {
            //             AddMonthCount: 0,
            //             AdditionsCount: 0
            //         }
            //     }
            // }).catch(function (err) {
            //     if (err.message) {
            //         vm.$message.error(err.message);
            //     }
            // });
        },
    },
    mounted:function(){
        this.fetchData();
    },
}
</script>

<style>
.pro-item {
    display: flex;
    align-items: center;
    height: 100px;
    border-bottom: 1px solid #eee;
}
.pro-item:last-child {
    border: none
}
.icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px; 
    height: 30px;
    border-radius: 8px;
    margin: 0 10px;
    background-color: #E5F5F5
}
.icon-box.month {
    /* background-image: url("../../../../../static/images/month.png"); */
    background-size: 15px 15px;
    background-repeat: no-repeat;
    background-position: center;
}
.icon-box .icon-img {
    width: 15px;
    height: 15px;
    border-radius: 2px;
    background: #32CED5;
}
.pro-item .data-box {
    flex: 1;
    display: flex;
    height: 60px;
    flex-direction: column;
    justify-content: space-between;
}
.pro-item .data-box .number {
    font-size: 20px;
    font-weight: bold;
}
</style>