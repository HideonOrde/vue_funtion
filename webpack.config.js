//引包
const VueLoaderPlugin = require('vue-loader/lib/plugin')

//默认暴漏一个配置，因为webpack是基于nodejs的，这里是nodejs的暴露语法
module.exports = {
    //模式,develoment表示开发模式，production表示上线了，代码会压缩
    mode: 'development',
    //入口，就是从哪个文件开始
    entry:'./src/main.js',
    //打包出口，就是打包为什么文件
    output:{
        //打包的文件名
        filename:'bundle.js',
        //打包的虚拟路径,也是发布路径，值是“xuni”，表示一会发布到xuni这个路径下。
        publicPath:'xuni'
    },
    //配置一下webpack-dev-server的一些属性
    devServer:{
        //端口号
        port:'8080',
         //静态文件的目录，www文件夹是静态资源文件夹，表示以当前文件夹为根目录。
        contentBase:'./www',
        //代理跨域
        
        proxy:{
          "/f": {
            target: "http://127.0.0.1:3000",
            pathRewrite: {"^/f" : ""}
          }
        }

    },
    //module表示额外的插件
    module: {
        rules: [
          //这里安装了vue-loader，意思是所有扩展名为.vue结尾的，都用vue-loader处理，
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          //这里安装了less-loader
          {
            test: /\.less$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
              {
                loader: 'less-loader',
                options: {
                  lessOptions: {
                    strictMath: true,
                  },
                },
              },
            ],
          },
        ]
      },
      //这是vue的插件，必须安装
      plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin()
      ]
}