var getWebConfig = null;

console.info('dev',process.env.CODE_ENV)
if(process.env.CODE_ENV == 'dev'){
    getWebConfig = function(){
        return {
            serverHost: "http://localhost:8001", // test
    
            // writeUrl: "http://rmis.ideasoft.net.cn:8913/", // test
            // readUrl: "http://rmis.ideasoft.net.cn:8913/", // test
            // fileUrl: "http://rmis.ideasoft.net.cn:8913/", // test

            redirectUrl: "https://hzs.coli688.com/default.aspx", // 分供方登录页
            redirectCP: "https://hzs.coli688.com/Common/PasswordEdit.aspx", // 分供方修改密码页
            up6Server: "http://172.56.2.28:3334/",
            pageSize: 10, //分页的默认每页显示条数
            pageArr: [10, 20, 50, 100],
            timeout: 2000,
        }
    }
}



export default getWebConfig

