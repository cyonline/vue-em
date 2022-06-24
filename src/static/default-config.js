
export default function getDefaultConfig (config) {
    const serverHost = config.serverHost || ''
    const webConfig = {
        baseUrl: `${serverHost}/sys`,
        // 异步请求超时
        timeout: 20000,
        // 分页条数
        pageSize: 15,
        // token有效时间
        tokenExpireInterval: 1800,
        // 登录授权
        loginAuthorization: 'Basic V2ViQXBwOnNhcGlAMTIzNA==', // header中authorization格式
        // rsa公匙
        rsaPublicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCW5u7xSp7xHc6OeHetFGqsH8aG' +
        'MGKhAGISgeAWOuvV8yZNPLp1iJdsdpTzb879QICTG/fGXI83mqVP1HM/UY430HU5' +
        'U22ADH+D9UYUgcYzj/iyCZQPVlRyZDPD3Uvji7GsgiPqOosrKMpaaXcEpPo4Zl9DpgSp16FScbRHA4BpMwIDAQAB',
        // 当前客户端应用
        client: 'web',
        
    }

    return webConfig
}
