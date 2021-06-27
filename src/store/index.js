import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        sideMenu:[],
        isCollapse:false,
    },
    mutations:{
        changeSideMenu(state,item){
            console.info(state,item);
            this.state.sideMenu = item;
        },
        toggleCollapse(state,isCollapse){
            this.state.isCollapse = isCollapse
        }
    }

})

export default store;
