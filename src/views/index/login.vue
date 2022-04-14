<template>
    <div id="login" class="login" @keyup.enter="login" v-cloak>
        
        <div class="login-box">
            <div class="form-body">
                <img class="login-logo" src="../../assets/images/logo-red.png" alt="中海地产">
                <el-form :model="user" ref="loginForm" label-position="left" label-width="0">
                    <div class="form-group form-name">
                        <el-form-item prop="uname" :rules="setRules.uname">
                            <el-input placeholder="用户名" size="large" v-model="user.uname">
                            </el-input>
                            <div class="input-icon"><i class="iconfont icon-icon1460188199600"></i></div>
                        </el-form-item>
                    </div>
                    <div class="form-group">
                        <el-form-item prop="pwd" :rules="setRules.pwd">
                            <el-input placeholder="密码" size="large" v-model="user.pwd" type="password">
                            </el-input>
                            <div class="input-icon"><i class="iconfont icon-mima"></i></div>
                        </el-form-item>
                    </div>
                    <el-checkbox-group v-model="checkList" class="remember-user-info">
                        <el-checkbox label="记住用户名及密码"></el-checkbox>
                        <el-checkbox label="自动登录" @change="checkRemerber"></el-checkbox>
                    </el-checkbox-group>
                    <el-button type="primary" size="large" class="btn-login" @click="login">登录</el-button>
                </el-form>
            </div>
        </div>
            
    </div>
</template>
<script>
export default {
    name: 'login',
    data(){
        return {
                user: {
                    uname: "",
                    pwd: "",
                },
                mobileConfig: {
                    AppDownUrl: '',
                    AppQRCodeUrl: '',
                    AppPlistUrl: '',
                    AppApkUrl: ''
                },
                setRules: {
                    "uname": [{ required: true, message: '请输入用户名', trigger: 'change' }],
                    "pwd": [{ required: true, message: '请输入密码', trigger: 'change' }]
                },
                checkList: [],
                pubkey:  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpKt4XzMOHfW4yW6/JOd1H6wDqjWgYDVZq1a3ZL5z6B4kY9d70x1x69L2mh0ff1zy+hqtRlL9L7W784ROWRx83a5DJeKEGVtohB1QEo2YvHgUPho89hkKNtuXe8kdWlOnQvLlEAV3j8PQBqkxq8K2bRzoBwos8DOil/t2yqR3GYQIDAQAB"
            }
    },
    methods:{
        postLoginData: function() {
                var _this = this;
                var grant_type = 'password';
                var session = window.sessionStorage;

                // if(this.user.uname.indexOf('\\') != -1) {
                //     grant_type = 'domain';
                // }
                // var res = this.$request.get('/user/list',{});
                let params = {
                    username: _this.user.uname,
                    password: _this.user.pwd
                }
                console.info(params);
                // var res = this.$http({
                //     url: '/user/login',
                //     methods: 'get',
                //     params:params
                // });
                var res = this.$http.get( '/user/login', params);
                res.then(res=>{
                    console.info(res);
                    
                    if(res.code == 200){
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        })
                        this.$router.push({
                            name: 'index'
                        })
                    }else{
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
                session.setItem('loginType', 0);
                _this.rememberUserInfo();
                // var encrypt = new JSEncrypt();
                // encrypt.setPublicKey(_this.pubkey);
                // var enUserName = encrypt.encrypt(_this.user.uname);
                // var enPwd = encrypt.encrypt(_this.user.pwd);
                localStorage.setItem('username',this.user.uname)
                
            },
            login: function() {
                var _this = this;
                
                if(_this.submitForm('loginForm')) {
                    _this.postLoginData();
                }
            },
            changeLang: function(type) {
                var lang = window.localStorage.getItem("language");
                var change = !type ? 'cn' : 'en';
                if ((!lang && change == 'en') || (lang && change != lang)) {
                    window.localStorage.setItem("language", change);
                    window.location.reload(true);
                }
            },
            submitForm: function(formName) {
                var res = false;
                this.$refs[formName].validate(function(valid) {
                    if (valid) {
                        res = true;
                    } else {
                        res = false;
                    }
                });
                return res;
            },
            rememberUserInfo: function() {
                var that = this;
                var uname64 = window.btoa(that.user.uname)
                var pwd64 = window.btoa(that.user.pwd)
                if(that.checkList.indexOf('记住用户名及密码') != -1){
                    window.localStorage.setItem('userName', uname64)
                    window.localStorage.setItem('passWord', pwd64)
                    window.localStorage.setItem('rememberNamePsd', '1')
                }else{
                    window.localStorage.removeItem('userName');
                    window.localStorage.removeItem('passWord');
                    window.localStorage.removeItem('rememberNamePsd')
                }
                
                if(that.checkList.indexOf('自动登录') != -1){
                    window.localStorage.setItem('autoLogin', '1');
                }else{
                    window.localStorage.removeItem('autoLogin');
                }
            },
            getAppConfig: function () {
                var _this = this;
                $.request({
                    url: '/api/mobileSetting',
                    type: "post",
                    isLoad: true,
                    isLogin: true,
                    data: {},
                    success: function (data) {
                        _this.mobileConfig = data.Data; 
                    }
                });
            },
            checkRemerber: function () {
                if(this.checkList.indexOf('自动登录') != -1 && this.checkList.indexOf('记住用户名及密码') == -1){
                    this.checkList.push('记住用户名及密码');
                }
            }
    },
    mounted(){
        var localUserName = window.atob(window.localStorage.getItem('userName'));
            var localPassWord = window.atob(localStorage.getItem('passWord'));
            var autoLogin = window.localStorage.getItem('autoLogin');
            var rememberNamePsd = window.localStorage.getItem('rememberNamePsd')
            if(rememberNamePsd === '1'){
                this.user.uname = localUserName;
                this.user.pwd = localPassWord;
                this.checkList.push('记住用户名及密码');
                if(autoLogin == '1'){
                    this.checkList.push('自动登录');
                    this.login();
                }
            };
    }
}
</script>
<style lang="less">
.login {
    width: 100%;
    height: 100%;
    background-image: url("../../assets/images/login-bg1.jpg");
    background-size: cover;
    background-position: center;
    position: relative;
}

.lang-box {
    position: absolute;
    top: 20px;
    right: 20px;
}
.lang-box-app {
    position: absolute;
    top: 30px;
    right: 100px;
}
.login-box {
    width: 320px;
    height: 360px;
    padding: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -180px;
    margin-left: -160px;
    background-color: #fff;
    border-radius: 4px;
}

.login-logo {
    width: 250px;
    height: 60px;
    margin-bottom: 30px;
}

.login-box .form-group {
    margin-bottom: 5px;
}

.login-box .form-name .el-form-item__error {
    position: relative;
}

.login-box .el-form-item {
    margin-bottom: 0;
}

.login-box .el-input__inner {
    border: 1px solid #ddd;
    height: 48px;
    line-height: 48px;
    padding-left: 30px;
}

.login-box .input-icon {
    position: absolute;
    top: 4px;
    left: 10px;
}

.login-box .btn-login {
    width: 100%;
    height: 48px;
    margin-top: 10px;
}

.remember-user-info{
    margin-top: 10px;
    margin-top: 10px;
}

.remember-user-info{
    margin-top: 10px;
}
.app-img-box {
    width: 150px;
    height: 150px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    position: absolute;
    top: 40px;
    left: -33px;
    border-radius: 3px;
    z-index: 100;
    display: none;
    border: 1px solid #eee;
}
.app-img-box img{
    width: 100%;
}
.app-down{
    position:relative;
    width: 150px;
    height: 150px;
}

</style>
