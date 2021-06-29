<template>
    <div class="sapi-layout" :class="isCollapse?'left-close':''">
        <nav-header></nav-header>
        <nav-sidebar></nav-sidebar>
        <sapi-content>
            <slot></slot>
        </sapi-content>
        <!-- <navHeader></navHeader> -->
    </div>
</template>
<script>
import navHeader from './nav-header';
import navSidebar from './nav-sidebar';
import sapiContent from './sapi-content';
export default {
    name:'layout',
    data(){
        return {

        }
    },
    computed:{
        isCollapse:function(){
            console.info(this.$store.state.isCollapse)
            return this.$store.state.isCollapse;
        }
    },
    props:{},
    methods:{

    },
    components:{
        navHeader,
        navSidebar,
        sapiContent
    }
}
</script>
<style lang="less">
    // @import url('./layout.css');
    .sapi-layout{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>