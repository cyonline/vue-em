<template>
    <div id="login"  @keyup.enter="login" v-cloak>
        
        <div class="login-box login" :class="isAnimate?'loginHide':'loginShow'">
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
                    <div class="form-group form-password">
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
                <a class="goRegister" @click="toggleState">没有账号?请先注册</a>
            </div>
        </div>
        <div class="login-box register" :class="isAnimate?'registerShow':'registerHide'">
            <div class="form-body">
                <div class="register-title">注册新账号</div>
                <!-- <img class="login-logo" src="../../assets/images/logo-red.png" alt="中海地产"> -->
                <el-form :model="newUser" ref="registerForm" label-position="left" label-width="0">
                    <div class="form-group form-name">
                        <el-form-item prop="uname" :rules="setRules.uname">
                            <el-input placeholder="用户名" size="large" v-model="newUser.uname">
                            </el-input>
                            <div class="input-icon"><i class="iconfont icon-icon1460188199600"></i></div>
                        </el-form-item>
                    </div>
                    <div class="form-group form-email">
                        <el-form-item prop="email" :rules="setRules.email">
                            <el-input placeholder="邮箱" size="large" v-model="newUser.email">
                            </el-input>
                            <div class="input-icon"><i class="el-icon-message"></i></div>
                        </el-form-item>
                    </div>
                    <div class="form-group form-password">
                        <el-form-item prop="pwd" :rules="setRules.pwd">
                            <el-input placeholder="密码" size="large" v-model="newUser.pwd" type="password">
                            </el-input>
                            <div class="input-icon"><i class="iconfont icon-mima"></i></div>
                        </el-form-item>
                    </div>
                    <el-button type="primary" size="large" class="btn-login" @click="register">注册</el-button>
                </el-form>
                <a class="goLogin" @click="toggleState">已有账号,直接登录</a>
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
                newUser: {
                    uname: '',
                    pwd: '',
                    email: '',
                },
                mobileConfig: {
                    AppDownUrl: '',
                    AppQRCodeUrl: '',
                    AppPlistUrl: '',
                    AppApkUrl: ''
                },
                setRules: {
                    "uname": [{ required: true, message: '请输入用户名', trigger: 'change' }],
                    "email": [{ required: true, message: '请输入邮箱', trigger: 'change' }],
                    "pwd": [{ required: true, message: '请输入密码', trigger: 'change' }]
                
                },
                checkList: [],
                pubkey:  "",
                isAnimate: false,
            }
    },
    methods:{
        postLoginData: function() {
                var _this = this;
                
                let params = {
                    username: _this.user.uname,
                    password: _this.user.pwd
                }
                console.info(params);
                this.$http.get('/public/authorize', params).then(res=>{
                    console.info(res);
                    if(res.code == 200){
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        })
                        localStorage.setItem('access_token',res.data.access_token)
                        localStorage.setItem('expiresTime',res.data.expiresTime)
                        this.$router.push({
                            name: 'index'
                        })
                    }else{
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
                sessionStorage.setItem('loginType', 0);
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
            register(){
                if(this.submitForm('registerForm')){
                    this.postRegisterData()
                }
            },
            postRegisterData(){
                let params = {
                    username: this.newUser.uname,
                    password: this.newUser.pwd,
                    email: this.newUser.email
                }
                console.info(params);
                this.$http.post('/public/register', params).then(res=>{
                    console.info(res);
                    if(res.code == 200){
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        })
                        this.$refs['registerForm'].resetFields();
                    }else{
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
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
        
            checkRemerber: function () {
                if(this.checkList.indexOf('自动登录') != -1 && this.checkList.indexOf('记住用户名及密码') == -1){
                    this.checkList.push('记住用户名及密码');
                }
            },
            toggleState(){
                this.isAnimate = !this.isAnimate;
            },
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
#login {
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

    .form-group {
        margin-bottom: 5px;
    }
    .form-name,.form-email {
        .el-form-item__error {
            position: relative;
        }
    }
    .el-form-item {
        margin-bottom: 0;
    }
    .el-input__inner {
        border: 1px solid #ddd;
        height: 48px;
        line-height: 48px;
        padding-left: 30px;
    }
    .input-icon {
        position: absolute;
        top: 4px;
        left: 10px;
    }
    .btn-login {
        width: 100%;
        height: 48px;
        margin-top: 10px;
    }
    .btn-login {
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
    .login-logo {
        width: 250px;
        height: 60px;
        margin-bottom: 30px;
    }
}
.goRegister{
    float: right;
    cursor: pointer;
    color: @text-blue;
    line-height: 36px;
}
.goLogin{
    float: right;
    cursor: pointer;
    color: @text-blue;
    line-height: 36px;
}
.login{
    // left: 38%;
    z-index: 1;
    &.loginHide{
        animation: loginHide 0.5s ease-in-out;
        box-shadow: none;
        z-index: 0;
        // margin-top: -180px;
    }
    &.loginShow{
        animation: loginShow 0.5s ease-in-out;
        box-shadow: none;
        z-index: 1;
        margin-top: -180px;
    }
}
.register{
    // left: 60%;
    z-index: 0;
    &.registerShow{
        animation: registerShow 0.5s ease-in-out;
        box-shadow: none;
        z-index: 1;
        // margin-top: -180px;
    }
    &.registerHide{
        animation: registerHide 0.5s ease-in-out;
        box-shadow: none;
        z-index: 0;
        margin-top: -180px;
    }
    .register-title{
        text-align: center;
        font-size: 20px;
        font-weight: 400px;
        margin-bottom: 25px;
    }
}


@keyframes loginHide {
    0% {
        box-shadow:1px 1px 10px -5px #000;
        z-index: 1;
    }
    50% {
        left: 38%;
        z-index: 1;
        margin-top: -185px;
    }
    51%{
        z-index:0
    }
    100% {
        left: 50%;
        z-index: 0;
        margin-top: -180px;
    }
}
@keyframes loginShow {
    0% {
        box-shadow: 1px 1px 10px -5px #000;
        z-index: 0;
    }
    50% {
        left: 38%;
        z-index: 0;
        margin-top: -185px;
    }
    51%{
        z-index:1
    }
    100% {
        left: 50%;
        z-index: 1;
        margin-top: -180px;
    }
}
@keyframes registerShow {
    0% {
        box-shadow: 1px 1px 10px -5px #000;
        z-index: 0;
    }
    50% {
        left: 60%;
        z-index: 0;
        margin-top: -195px;
    }
    51%{
        z-index:1;
    }
    100% {
        left: 50%;
        z-index: 1;
        margin-top: -180px;
    }
}
@keyframes registerHide {
    0% {
        box-shadow: 1px 1px 10px -5px #000;
        z-index: 1;
    }
    50% {
        left: 60%;
        z-index: 1;
        margin-top: -195px;
    }
    51%{
        z-index:0;
    }
    100% {
        left: 50%;
        z-index: 0;
        margin-top: -180px;
    }
}




</style>
