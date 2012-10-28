(function() {
    var __widgetspath = "../../";
    KISSY.config({
        packages: [{
            name : 'widgets',
            path : __widgetspath,
            charset:'gbk',
            tag:'20120920'
        }],
        map:[
           [/(.+widgets\/.+)-min.js(\?[^?]+)?$/, "$1.js$2"], // ����widgetĿ¼���ļ�ʱ���-min��׺
           [/(.+widgets\/.+)-min.css(\?[^?]+)?$/, "$1.css$2"]
        ]
    });
})();


