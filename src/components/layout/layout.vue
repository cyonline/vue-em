<template>
    <div id="sapi-layout">
        <nav-header></nav-header>
        <nav-sidebar></nav-sidebar>
        <sapi-content></sapi-content>
        <!-- <navHeader></navHeader> -->
    </div>
</template>
<script>
import navHeader from './nav-header';
import navSidebar from './nav-sidebar';
import sapiContent from './sapi-content';
export default {
    data(){
        return {

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