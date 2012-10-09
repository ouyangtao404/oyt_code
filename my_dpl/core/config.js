(function() {
    var __widgetspath = "/develop/oyt_code/my_dpl/";
    KISSY.config({
        packages: [{
            name : 'widgets',
            path : __widgetspath,
            charset:'gbk',
            tag:'20120920'
        }],
        map:[
           [/(.+widgets\/.+)-min.js(\?[^?]+)?$/, "$1.js$2"], // 请求widget目录下文件时均不带-min后缀
           [/(.+widgets\/.+)-min.css(\?[^?]+)?$/, "$1.css$2"]
        ]
    });
})();


