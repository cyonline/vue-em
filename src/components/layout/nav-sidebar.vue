<template>
    <div class="sapi-siderbar">
        <div class="left-inner-box">
                <div :class="['collapse-wrapper', isCollapse ? 'is-open':'']" @click="toggleCollapse">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <!-- 使用 el-scrollbar 导致 el-menu 的collapse为true 时 侧边导航被遮掉，在 .el-menu--collapse类上加 fixed解决（不过会产生当的collapse为true时滚动组件无效，无大的影响） -->
                <el-scrollbar class='page-component__scroll' :noresize="false">
                    <el-menu class="index-menu" @select="chooseMenuList" :collapse="isCollapse" :default-active="acitveIndex"  :default-openeds="openeds" router>
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
    watch:{
        menuData(val){
            console.info('watch',val)
            if(val.length>0 && val[0].Children){
                this.$router.replace(val[0].Children[0].MenuPath)

            }
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
            // 默认展开第一个子级
            return menu.length>0?  [menu[0].MenuId]:[]
        },
        acitveIndex(){
            var menu = this.$store.state.sideMenu;
            return menu.length>0? menu[0].Children[0].MenuPath:''
        }
    },
    methods:{
        chooseMenuList(index,path){
            console.info('side',path)
            // 修复重复点击同一个路由报错
            // if(path == this.$route.path){
            //     return;
            // }
            // this.$router.push({
            //     path: path,
            // });   
        },
        toggleCollapse(){
            this.setCollapse = !this.setCollapse;
            
            this.$store.commit('toggleCollapse', this.setCollapse);
        }
    },
    mounted(){
        console.info('mounted');
        // console.info(this.$store.state.sideMenu)
        // this.chooseMenuList(this.$store.state.sideMenu[0].MenuPath)
        
    },
    updated(){
        console.info('updated')
        // 判断侧边栏是否有菜单;菜单下第一个子级是否有子菜单
        // if(this.menuData.length>0 && this.menuData[0].Children){
        //     this.$router.replace(this.menuData[0].Children[0].MenuPath)

        // }
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