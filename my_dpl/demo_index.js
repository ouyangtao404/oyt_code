/** 
 * @fileoverview demo_index.js
 * @desc ouyangtao�ĸ���dplģ��չʾҳ�߼�
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
         * ��ز���
         * dpl�����ֺ͵�ַ
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
         * �����趨
         */
        _bindParam: function(){
            var self = this;
            self.container = _O(self.config.container);
            self.showBox = _O('#'+ IFRAME_ID);
        },
        /*
         * ��ȡ����
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
         * �����¼�
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
         * ����ĳ��dpl
         * 
         */
        /** 
         * ����ĳ��dpl
         * @param {Number} target ��ת�Ĳ���������ֵ 
         */  
        goTo: function(target){
            if(typeof target !== 'string' && typeof target !== 'number'){
                throw new Error('parameter error!');
                return;
            }
            var self = this;
            //��ȵ�ʱ��˵����Ҫ��ת��ģ������ֵ���ǵ�ǰ�ģ�����Ҫ��ת��
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

//��ʼ��http://baohe.taobao.com/assets/widgets/NewLogin/NewLogin.js?t=20120905
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
            name: '�ֻ�ҳͷ�����޸�ǩ������',
            link: 'demoList/changeSkin/demo.html'
        },
        {
            name: '�ٶ�',
            link: 'http://www.baidu.com'
        }
    ];
    B.index.config.container = '.leftlist';
    B.index.init();
});
