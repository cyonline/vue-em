# em

> vue for em

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


### 06.24
遇到了两个问题：
1. less文件怎么全局引入。
  解决方法：添加sass-resources-loader,
  `npm install sass-resources-loader`
  在utils.js中生成loader的方法里添加如下代码(经过测试好像只有build的时候用到了，dev没有用到，最后结果common.less能够被编译，但是在common.less中引入其他less文件就报错了，后面再解决这个问题)。
  参考:https://blog.csdn.net/Forever201295/article/details/105227125 
  https://www.cnblogs.com/cangqinglang/p/10573151.html
  ```js
loaders.push({
          
    loader: 'sass-resources-loader',
    options: {
        resources: [
        path.resolve(__dirname, '../src/style/common.less'),
        // path.resolve(__dirname, '../src/common/less/variable.less')
        ],
        javascriptEnabled: true,
    }
})
  ```
2. build之后直接打开index.html找不到css,js等资源，原因是src后面的路径是'/'开头的，这个路径代表是服务器上部署项目的根目录，改成相对路径就行了。参考：https://blog.csdn.net/weixin_40660408/article/details/95610026
解决方法：把config.build.assetsPublicPath改成'./'
