<template>
    <div class="sapi-siderbar">
        <div class="left-inner-box">
                <div :class="['collapse-wrapper', isCollapse ? 'is-open':'']" @click="toggleCollapse">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <!-- 使用 el-scrollbar 导致 el-menu 的collapse为true 时 侧边导航被遮掉，在 .el-menu--collapse类上加 fixed解决（不过会产生当的collapse为true时滚动组件无效，无大的影响） -->
                <el-scrollbar class='page-component__scroll' :noresize="false">
                    <el-menu class="index-menu" @select="chooseMenuList" :collapse="isCollapse" :default-openeds="openeds">
                        <index-menu :data="menuData" :icon="true"></index-menu>
                    </el-menu>
                </el-scrollbar>
            </div>
    </div>
</template>

<script>
import IndexMenu from './index-menu';
export default {
    name:'nav-sidebar',
    components:{IndexMenu},
    data(){
        return {
            title: 'sidebar',
            setCollapse: false,
            // menuData:[],
            // openeds:[],
        }
    },
    computed:{
        menuData:{
            get(){
                
                return this.$store.state.sideMenu
            },
        },
        isCollapse:{
            get(){
                return this.$store.state.isCollapse
            },
            set(v){
                // 从业务逻辑里去改变computed里定义的值时需要set进行手动改变
                this.setCollapse = v;
            }
        },
        openeds(){
            var menu = this.$store.state.sideMenu;
            this.chooseMenuList(menu[0])
            return menu.length>0? [menu[0].MenuId]:[]
        }
    },
    methods:{
        chooseMenuList(item){
            console.info('side',item)
            this.$router.push({
                path: item,
            });
            
        },
        toggleCollapse(){
            this.setCollapse = !this.setCollapse;
            
            this.$store.commit('toggleCollapse', this.setCollapse);
        }
    },
    mounted(){
        
    },

    updated(){
        console.info('xx',this.menuData)
       
       
    },
}
</script>
<style lang="less">
    .sapi-siderbar{
        // display: inline-block;
        float:left;
        
        height: calc(~"100% - 60px");
        background: @theme-color;
        .left-inner-box{
            position: relative;
            width: 200px;
            height: 100%;
        }
    }
    
</style>