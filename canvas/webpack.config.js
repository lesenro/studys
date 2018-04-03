//路径相关
const path = require('path');
//文件复制插件
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 处理html文件，生成index.html
const HtmlWebpackPlugin = require('html-webpack-plugin');
//打包前清理旧的打包目录
const CleanWebpackPlugin = require('clean-webpack-plugin');
//删除精简导出的代码
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//webpack对象
const webpack = require('webpack');
//配置合并
const merge = require('webpack-merge');
//公用文件存放位置
const ASSET_PATH = '/asset/';
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

//通用配置
const common = {
    entry: {
        app: [
            './src/index.js', "./src/css/global.css"
        ],
        // vendor: ["slick-carousel", "fullpage.js", "video.js", "jquery-mousewheel", "malihu-custom-scrollbar-plugin", "jquery"]
    },
    resolve: {
        // "alias": {     'jquery': path.resolve(__dirname,
        // './node_modules/jquery/jquery.min.js'), }, extensions: ['.js']
    },
    module: {
        rules: [{
            test: /\.(jsx|js)?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', "stage-2"]
                }
            }
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name(file) {
                        return 'imgs/[hash:8].[ext]'
                    }
                }
            }]
        },  {
            test: /\.(svg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name(file) {
                        return 'svgs/[name].[ext]'
                    }
                }
            }]
        },{
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name(file) {
                        return 'css/[hash:8].[ext]'
                    }
                }
            }]
        }]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: "./public/js",
            to: path.resolve(__dirname, 'dist/js')
        },{
            from: "./public/img",
            to: path.resolve(__dirname, 'dist/img')
        }]),
        new HtmlWebpackPlugin({ template: "./public/index.html" }),

        new webpack
        .optimize
        .CommonsChunkPlugin({
            names: ["vendor", "manifest"]
        }),
        ////new webpack.ProvidePlugin({$: 'jquery', jQuery: "jquery"})
    ],
    output: {
        path: __dirname + "/dist/",
        filename: "js/[name].js",
        publicPath: "/"
    }
};
//开发环境
const dev = merge(common, {
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", {
                loader: 'css-loader',
                options: {
                    sourceMap: true
                }
            }]
        }]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
        historyApiFallback: true,
        port: 8080
    }
});
//生产环境
const prod = merge(common, {
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader" })
        }]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin({ filename: "css/style.css", allChunks: true }),
        new UglifyJSPlugin(),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        })
    ]
});

module.exports = env => {
    if (env && env.production) {
        return prod;
    } else {
        return dev;
    }
};