<template>
    <div>
        <el-dialog
            title="修改头像"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <div></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="close">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    computed:{
        dialogVisible:{
            set:function(val){
                this.visible = val
            },
            get:function(){
                return this.visible
            }
        }
    },
    props:{
        visible: {
            type: Boolean,
            default: false
        }
    },
    methods:{
        handleClose(){

        },
        close(){
            this.$emit('update:visible',false)
        }
    },
    created(){

    },
    mounted(){

    }
}
</script>
<style lang="less" scoped>
    
</style>