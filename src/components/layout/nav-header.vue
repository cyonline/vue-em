<template>
    <div id="sapi-header">
        <div class="header-box">
            
        </div>
    </div>
</template>
<script>
export default {
    name: 'nav-header',
    data(){
        return {
            title:'header'
        }
    },
    methods:{
        getData(){
            this.$http('/api/users/menus').then((data) => {
                console.info(data);
            })
        }
    },
    mounted(){
        this.getData();
    }
}
</script>
<style lang="less">
    #sapi-header{
        .header-box{
            display: inline-block;
            width: 100%;
            height: 50px;
            background: #ddd;
        }
    }
</style>