<template>
    <div >
        <template v-for="menu in data">
            <el-tooltip v-if="menu.Children.length == 0 && menu.IconPath" :key="menu.MenuId"
             class="item" effect="dark" :content="menu.MenuName" placement="right">
                <el-menu-item :id="'menu' + menu.MenuId" :index="menu.MenuPath">
                    <template slot="title">
                        <i v-if="icon" :class="['el-icon-', 'iconfont', menu.IconPath ? menu.IconPath : 'icon-tian']"></i>
                        <span>{{menu.MenuName}}</span>
                    </template>
                </el-menu-item>
            </el-tooltip>
            <el-menu-item v-if="menu.Children.length == 0 && !menu.IconPath" :id="'menu' + menu.MenuId" :key="menu.MenuId"
            :index="menu.MenuPath">
                <template slot="title">
                    <i v-if="icon" :class="['el-icon-', 'iconfont', menu.IconPath ? menu.IconPath : 'icon-tian']"></i>
                    <span>{{menu.MenuName}}</span>
                </template>
            </el-menu-item>
            <el-submenu v-if="menu.Children.length > 0" :index="menu.MenuPath" :key="menu.MenuId">
                <template slot="title">
                        <i v-if="icon" :class="['el-icon-', 'iconfont', menu.IconPath ? menu.IconPath : 'icon-tian']"></i>
                        <span>{{menu.MenuName}}</span>
                </template>
                <index-menu :data="menu.Children"></index-menu>
            </el-submenu>
        </template>    
    </div>
</template>
            
<script>
export default {
    name: 'index-menu',
    props: {
            data: { type: Array, default: [] },
            icon: { type: Boolean, dafault: false }
        },
    methods:{
       
    },
    mounted(){
        console.info('indexMenu',this.data)
        
    },
    
}
</script>
        