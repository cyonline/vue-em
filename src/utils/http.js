import axios from 'axios'
// import router from '@/router/routers'
import { Notification, MessageBox } from 'element-ui'
// import store from '../store'
// import { getToken } from '@/utils/auth'
import Config from './config'

// import { baseUrl } from '@/utils/env'

function getToken(){
    var ws = window.localStorage;
    let nowTime = new Date().getTime();
    let expiresTime = ws.getItem('expiresTime')
    // if ((nowTime < expiresTime && expiresTime - nowTime < 300000) || nowTime > expiresTime) {
    //     axios.post("/Authorize").then(res=>{
    //         ws.setItem('access_token',res.data)
    //     })
    // }
    if (ws.getItem("access_token")) {
        var token = ws.getItem("access_token");
        return token;
    } else {
        // window.location.href = '/'
    }
}
// 创建axios实例
const service = axios.create({
    baseURL: Config.serverHost, // api 的 base_url
    // baseURL: process.env.BASE_API, // api 的 base_url
    timeout: Config.timeout, // 请求超时时间
    // withCredentials: true
})

// request拦截器
service.interceptors.request.use(
    request => {
        // console.info('xxx',request)
        let whilteList = ['/authorize','/register']; // 白名单中的接口不用携带token
        if (!whilteList.includes(request.url) && getToken()) {
            request.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        request.headers['Content-Type'] = 'application/json'
        return request
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        const code = response.status
        // console.log('response:',response)
        if (code < 200 || code > 300) {
            Notification.error({
                title: response.message
            })
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        let code = 0
        console.info('error:',error);
        try {
            code = error.response.data.status
        } catch (e) {
            if (error.toString().indexOf('Error: timeout') !== -1) {
                Notification.error({
                    title: '网络请求超时',
                    duration: 2500
                })
                return Promise.reject(error)
            }
            if (error.toString().indexOf('Error: Network Error') !== -1) {
                Notification.error({
                    title: '网络请求错误',
                    duration: 2500
                })
                return Promise.reject(error)
            }
        }
        if (code === 401) {
            MessageBox.confirm(
                '登录状态已过期，您可以继续留在该页面，或者重新登录',
                '系统提示',
                {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                // store.dispatch('LogOut').then(() => {
                //     location.reload() // 为了重新实例化vue-router对象 避免bug
                // })
            })
        } else if (code === 403) {
            // router.push({ path: '/401' })
        } else {
            const errorMsg = error.response.data.message
            if (errorMsg !== undefined) {
                Notification.error({
                    title: errorMsg,
                    duration: 2500
                })
            }
        }
        return Promise.reject(error)
    }
)

const http = {
    get: function(url,params){
        return service({
            url: url,
            method: 'get',
            params: params,
        })
    },
    post: function(url,params){
        return service({
            url: url,
            method: 'post',
            data: params,
        })
    },
    put: function(url,params){
        return service({
            url: url,
            method: 'put',
            data: params,
        })
    },
    delete: function(url,params){
        return service({
            url: url,
            method: 'delete',
            data: params,
        })
    },
}


export default http