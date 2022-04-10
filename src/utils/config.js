export default {

    // writeUrl: "http://192.168.1.144:1090/", // test
    // readUrl: "http://192.168.1.144:1090/", // test
    // fileUrl: "http://192.168.1.144:1090/", // test

    serverHost: "http://localhost:8001", // test
    // serverHost: "http://cyonline.club:8001/", // test
    // readUrl: "http://192.168.1.144:1100/", // test
    // fileUrl: "http://192.168.1.144:1100/", // test

    // writeUrl: "http://rmis.ideasoft.net.cn:8913/", // test
    // readUrl: "http://rmis.ideasoft.net.cn:8913/", // test
    // fileUrl: "http://rmis.ideasoft.net.cn:8913/", // test

    tipsColor: "#20A0FF", //提示框的颜色
    webClientId: "WebApp",
    H5ClientId: "H5App",
    redirectUrl: "https://hzs.coli688.com/default.aspx", // 分供方登录页
    redirectCP: "https://hzs.coli688.com/Common/PasswordEdit.aspx", // 分供方修改密码页
    up6Server: "http://172.56.2.28:3334/",
    pageSize: 10, //分页的默认每页显示条数
    pageArr: [10, 20, 50, 100],
    // 配置文件预览 
    fileViewUrl: "http://172.56.2.28:8050/",
    em_dir: "em_zhtest",
    timeout: 2000,
    
};

/* 
    loginType说明：
    0: 预帐号通过帐密登录 -> 失败或退出跳入我方登录页
    1: 预账号通过token登录 -> 失败或退出跳入我方登录页
    2: 分供方帐号通过token登录 -> 失败或退出跳入我方分供方登录页
*/