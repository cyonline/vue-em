import getDefaultConfig from './default-config'
import getProductConfig from './config.product.js'
import getDevConfig from './config.dev.js'

var getSceneConfig = getProductConfig || getDevConfig ||
    function (config) {
        return config
    }

export default function create (upperConfig) {
    const scenConfig = getSceneConfig(upperConfig)
    const defaultConfig = getDefaultConfig(scenConfig)
    Object.assign(defaultConfig, scenConfig, upperConfig)

    // if (defaultConfig.hasOwnProperty('serverHost')) {
    //     delete defaultConfig.serverHost
    // }

    return defaultConfig
}

