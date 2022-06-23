var getWebConfig = null;

if(process.env.CODE_ENV == 'product'){
    getWebConfig = function(){
        return {
            serverHost: "/api", // test
    
            // writeUrl: "http://rmis.ideasoft.net.cn:8913/", // test
            // readUrl: "http://rmis.ideasoft.net.cn:8913/", // test
            // fileUrl: "http://rmis.ideasoft.net.cn:8913/", // test

            pageSize: 10, //分页的默认每页显示条数
            pageArr: [10, 20, 50, 100],
            // 配置文件预览 
            timeout: 2000,
        }
    }
}

export default getWebConfig
