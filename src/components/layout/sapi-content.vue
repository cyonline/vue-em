<template>
    <div class="sapi-content">
        {{title}}
        <el-button @click="goPage('test')">默认按钮</el-button>
        <el-button type="primary" @click="goPage('helloWorld')">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger" @click="test">危险按钮</el-button>
        <slot></slot>
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
        float:left;
        width: calc(~'100% - 200px');
        height: calc(~'100% - 60px');
        overflow: hidden;
    }
</style>