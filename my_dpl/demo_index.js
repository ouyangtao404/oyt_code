/** 
 * @fileoverview demo_index.js
 * @desc ouyangtao的个人dpl模板展示页逻辑
 * @author baohe.oyt<ouyangtao404@qq.com> 
 * @date 20120911
 * @version 1.0 
 * @depends kissy
 */  
KISSY.app('B');
B.namespace('index');
B.index = (function () {
var S = KISSY,
    E = S.Event,
    D = S.DOM,
    _O = S.one,
    _A = S.all,
    
    IFRAME_ID = 'J_showBox',
    CURRENT_INDEX_CLASS = 'current';
    
    return {
        /*
         * 相关参数
         * dpl的名字和地址
         */
        config: {
            'dpl':[]
        },
        init: function () {
            var self = this;
            self._bindParam();
            self._renderData();
            self._attachEvent();
            self.goTo(0);
        },
        /*
         * 参数设定
         */
        _bindParam: function(){
            var self = this;
            self.container = _O(self.config.container);
            self.showBox = _O('#'+ IFRAME_ID);
        },
        /*
         * 读取数据
         */
        _renderData: function () {
            var self = this,
                config = self.config,
                one,
                i,
                str = '',
                len = this.config.dpl.length,
                dplList = this.config.dpl;
                con = D.create('<ul></ul>');
                
            for (i=0; i<len; i++) {
                str += '<li><a class="tpltitle" data-index="'+ i +'" href="'+ dplList[i].link +'">'+ dplList[i].name +'</a></li>';
            }
            D.html(con, str);
            self.container.append(con);
        },
        /*
         * 监听事件
         */
        _attachEvent: function () {
            var self = this,
                currentTplSrc;
            E.delegate(document, 'click', '.tpltitle', function (e) {
                e.halt();
                self.goTo(D.attr(e.target, 'data-index'));
            });
        },
        /*
         * 跳到某个dpl
         * 
         */
        /** 
         * 跳到某个dpl
         * @param {Number} target 跳转的参数的索引值 
         */  
        goTo: function(target){
            if(typeof target !== 'string' && typeof target !== 'number'){
                throw new Error('parameter error!');
                return;
            }
            var self = this;
            //相等的时候，说明需要跳转的模板索引值就是当前的，不需要跳转；
            if(self.currentIndexNumber && self.currentIndexNumber == target){
                return;
            }
            
            self.currentIndexNumber = self.currentIndexNumber? target : 0;
            
            var currentOne = D.get('.'+ CURRENT_INDEX_CLASS, self.container),
                waitOnes = D.query('.tpltitle', self.container);
            
            if (currentOne) {
               D.removeClass(currentOne, CURRENT_INDEX_CLASS); 
            }
            D.addClass(waitOnes[target], CURRENT_INDEX_CLASS);
            D.attr(self.showBox, 'src', self.config.dpl[target].link);
        }
    }    
})();

//初始化http://baohe.taobao.com/assets/widgets/NewLogin/NewLogin.js?t=20120905
KISSY.ready(function (S) {
    S.config({
        combine: true,
        tag: '20120911',
        base:'http://baohe.taobao.com/develop/my_dpl',
        packages: {
            packages: [{
                name : 'widgets',
                path : '../',
                charset:'gbk',
                tag:'20120911'
            }]
        },
        map: [
            [/(.+widgets\/.+)-min.js(\?[^?]+)?$/, "$1.js$2"],
            [/(.+widgets\/.+)-min.css(\?[^?]+)?$/, "$1.css$2"]
        ]
    });
    //debugger;
    S.use('widgets/PopWin/PopWin', function (S, x) {
      //  debugger;
      console.log(x);
    });
    B.index.config.dpl = [
        {
            name: '乐活页头换肤修改签名交互',
            link: 'demoList/changeSkin/demo.html'
        },
        {
            name: '百度',
            link: 'http://www.baidu.com'
        }
    ];
    B.index.config.container = '.leftlist';
    B.index.init();
});
