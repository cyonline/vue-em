<template>
    <div id="sapi-content">
        <!-- {{title}}
        <el-button>默认按钮</el-button>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger" @click="test">危险按钮</el-button> -->
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
        test(){
            var url = 'http://localhost:9014//mainDetail.html#/index?openid=oDrgP569CdNza-3GXr_Qq2NNqrCI'
            var s = this.$Base.getUrlParam(url);
            console.info(s)
        }
    }
}
</script>