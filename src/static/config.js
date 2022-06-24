import create from './tools-config'

var webConfig = {
    client: 'web',
    // 发布环境更改配置，优先级最高，添加属性可覆盖各个环境的配置和默认配置，
    // 项目中请勿直接使用，生成config对象之后会删除改属性
    // serverHost: ''
}

webConfig = create(webConfig)
console.info('webconfig',webConfig)
export default webConfig
