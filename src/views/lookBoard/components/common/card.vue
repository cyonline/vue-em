<template>
    <div class="card">
        <div class="card-title">
            <span class="left-title">
                <h4>{{title}}</h4>
            </span>
            <span class="right-title" @click="doMore">
                <!-- <slot name="right-title">更多></slot> -->
                <slot name="right-title"></slot>
            </span>
        </div>
        <div class="card-body">
            <slot name="default"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name:'card',
    data:function(){
        return{

        }
    },
    props:{
        title:{
            type: String,
            default:'',
        }
    },
    methods:{
        doMore:function(){
            this.$emit('do-more')
        }
    },
    
    mounted:function() {
        
    },
}
</script>
<style scoped>
    .card{
        width:100%;
        height: 100%;
        background: #fff;
        padding: 18px 20px 10px;
        box-shadow: 0px 1px 4px #ccc;
        border-radius: 3px;
    }
    .card-title {
        overflow: hidden;
        line-height: 20px;
    }
    .card-title h4{
        height: 20px;
        line-height: 20px;
        border-left: 4px solid #69a4e0;
        font-size: 15px;
        font-weight: bold;
        letter-spacing: 0px;
        color: #333333;
        margin-top: 0px;
        margin-bottom: 5px;
        padding-left: 10px;
        float: left;            
    }
    .right-title{
        float: right;
        color: #388D91;
        cursor: pointer;
    }
    .card-body{
        width: 100%;
        height: calc(100% - 25px);
        padding: 5px 10px;
        overflow: hidden;
    }
</style>