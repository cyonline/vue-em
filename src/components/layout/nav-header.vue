<template>
    <div id="sapi-header">
        <!-- <div class="header-box"> -->
            <div class="header">
                <div :class="['banner-wrapper',isCollapse ? 'w-60' :'w-200']">
                    <div class="login-box" >
                        <a href="index.html"><img :src="indexLogo" alt=""></a>
                        <div :class="['maskBanner',isCollapse ? 'w-150' :'w-0']" class=""></div>
                    </div>
                    <!-- <div class="login-icon" v-if="isCollapse">
                        <a href="index.html"><img src="static/images/logo-mini.png" alt=""></a>
                    </div> -->
                </div>
            <!-- <div :class="['clap-btn', isCollapse ? 'is-open':'']" @click="isCollapse=!isCollapse">
                <i class="iconfont icon-shink-20"></i>
            </div> -->
                <div class="top-menu">
                    <ul class="list-unstyled index-choose-list clearfix">
                        <li class="w-90" :class="[getActiveMenu(index)? 'active' : '']" v-for="(item, index) in menu" :key="index" @click="setActiveMenu(item,index)">
                            <!-- <i class="iconfont" style="padding: 5px;" :class="item.IconPath"></i> -->
                            {{item.MenuName}}
                        </li>

                        <li class="more" v-if="moreList.length">
                            <el-dropdown style="width: 90px;">
                                <span class="el-dropdown-link">
                                    <i class="iconfont icon-zuihouye-copy" style="padding: 5px;"></i>
                                    更多
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="(more, index) in moreList" :key="index" @click.native.stop="setActiveMenu(more, menu.length + index)">
                                        <i :class="['iconfont', 'el-icon-', more.IconPath]" style="padding: 7px;"></i>{{more.MenuName}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </li>
                    </ul>
                </div>
            </div>
        <!-- </div> -->
    </div>
</template>
<script>
export default {
    name: 'nav-header',
    data(){
        return {
            title:'header',
            isCollapse:false,
            indexLogo:'',
            moreList:'',
            menu:[],
        }
    },
    methods:{
        getData(){
            this.$http('/api/users/menus').then((res) => {
                console.info(res);
                this.menu = res.data;
            })
        },
        getActiveMenu(index){

        },
        setActiveMenu(item,index){
            console.info(item);
            this.$store.commit('changeSideMenu',item.Children)
        }
    },
    mounted(){
        this.getData();
    }
}
</script>
<style lang="less">
@import url('./layout.css');
    #sapi-header{
        .header-box{
            display: inline-block;
            width: 100%;
            height: 60px;
            background: #ddd;
        }
    }
</style>