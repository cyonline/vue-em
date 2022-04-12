<template>
    <div class="sapi-content" :class="isCollapse?'collapse':''">
        <!-- {{title}}
        <el-button @click="goPage('test')">默认按钮</el-button>
        <el-button type="primary" @click="goPage('helloWorld')">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger" @click="test">危险按钮</el-button> -->
        <!-- <slot></slot> -->
        <router-view/>
    </div>
</template>
<script>
// import * as Base from '../utils/base'

export default {
    name:'sapi-content',
    data(){
        return {
            title:'content'
        }
    },
    computed:{
        isCollapse(){
            return this.$store.state.isCollapse
        }
    },
    created(){
        console.info('created')
    },
    mounted(){
        console.info('moutd')
        console.info(this.$Base)
    },
    methods:{
        goPage(page){
            console.info(this.$router)
            this.$router.push({
                name: page,
                
            })
        },
        test(){
            var url = 'http://localhost:9014//mainDetail.html#/index?openid=oDrgP569CdNza-3GXr_Qq2NNqrCI'
            var s = this.$Base.getUrlParam(url);
            console.info(s)
        }
    }
}
</script>
<style lang="less">
    .sapi-content{
        // width: calc(~'100% - 200px');
        height: calc(~'100% - 60px');
        // padding-left: 200px;
        overflow: auto;
        background-color: #EFEFF4;
        transition:all 0.1;
        -webkit-transition:all 0.3s;
        &.collapse{
            //  padding-left: 65px;
        }
        &>div{
            height: 100%;
        }
    }
</style>