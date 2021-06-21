import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'

Vue.use(VueRouter)

export default function createRouter(beforeEach,afterEach){
    const router = new VueRouter({
        mode: 'hash',
        routes,
    });
    return router;
}