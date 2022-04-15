<template>
    <div id="sapi-header">
        <!-- <div class="header-box"> -->
            <div class="header">
                <div :class="['banner-wrapper',isCollapse ? 'w-60' :'w-200']">
                    <div class="header-logo">
                        <a href="index.html"><img :src="indexLogo" alt=""></a>
                        <div :class="['maskBanner',isCollapse ? 'w-150' :'w-0']" class=""></div>
                    </div>
                    <!-- <div class="login-icon" v-if="isCollapse">
                        <a href="index.html"><img src="static/images/logo-mini.png" alt=""></a>
                    </div> -->
                </div>
                <div :class="['clap-btn', isCollapse ? 'is-open':'']" @click="toggleCollapse">
                    <i class="iconfont icon-shink-20"></i>
                </div>
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
                <div class="user-info">
                        <el-avatar class="user-avatar" size="medium" :src="squareUrl" @error="true">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                        </el-avatar>
                    <div class="user-name">{{username}}</div>
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="iconfont icon-set2" command="a">用户信息</el-dropdown-item>
                            <el-dropdown-item icon="iconfont icon-login-out" command="b">退出</el-dropdown-item>
                            
                        </el-dropdown-menu>
                    </el-dropdown>
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
            setCollapse:false,
            indexLogo:require('../../assets/images/banner.png'),
            moreList:'',
            menu:[],
            curIndex:0,
            squareUrl: '',

        }
    },
    computed:{
        isCollapse:{
            set(v){
                this.setCollapse = v;
            },
            get(){
                return this.$store.state.isCollapse;
            }
        },
        username:()=>{
            return localStorage.getItem('username')
        }
    },
    methods:{
        getData(){
            this.$request('/api/users/menus').then((res) => {
                console.info('菜单:',res);
                this.menu = res.data;
                this.setActiveMenu(this.menu[0],0)
            })
        },
        getActiveMenu(index){
            return +index == this.curIndex;
        },
        setActiveMenu(item,index){
            console.info(item);
            this.curIndex = index;
            this.$store.commit('changeSideMenu',item.Children)
        },
        toggleCollapse(){
            this.setCollapse=!this.setCollapse;
            this.$store.commit('toggleCollapse',this.setCollapse)
        },
        handleCommand(c){
            switch(c){
                case 'a':
                    // 用户信息
                    break;
                case 'b':    
                // 退出登录
                break;
            }
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
        // .header-box{
        //     display: inline-block;
        //     width: 100%;
        //     height: 60px;
        //     background: #ddd;
            
        // }
        .user-info{
                float: right;
                width: 200px;
                height: 100%;
                // background: #ddd;
                display: flex;
                align-items: center;
                .user-avatar{
                    margin:0 10px;
                }
                .user-name{
                    max-width: 70px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 14px;
                    color: #fff;
                    margin-right: 10px;
                }
            }
        .el-dropdown-link{
            width: 50px;
            text-align: center;
        }    
    }
    


</style>