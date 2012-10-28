/**
 * intervein elements dynamically
 * @author baohe.oyt@taobao.com
 */

/**=====================================================
 * 改进的方面：
 * 	1.已经能看到编码的风格和习惯
 *  2.变量命名能简洁易读，私有属性都有下划线等
 *  3.结构清晰
 *  4.缩进统一
 *  5.有按照功能的区分去设计代码的结构
 *  6.对dom的操作能尽量合并的
 *  7.对闭包和对this的使用，有清晰的理解和使用
 *  其他细节
 *  
 * 
 * 不会把内部的变量
 * 还存在的一些问题：
 * 	1.有部分参考别处的代码的地方，没有统一编码格式
 *  2.还是缺少必要的注释
 *  3.接口的设计，没有很好的站在用户的角度，详情可参照初始化的入口；
 * 
 =====================================================*/
KISSY.add("waterfall", function(S) {
    var D = S.DOM,E = S.Event,UA = S.UA;
    function Waterfall(container, config) {
        var self = this;
        if(S.isString(container)) {
            self.container = D.get(container);
        }
        if(!container) {
            S.log('请配置正确的id.');
            return;
        }
        self._init(config || {});
    }
    S.augment(Waterfall, {
        _init: function(config){
            var self = this;
            window.isEnd = false;
            self._bindParam(config);
            self._bindStructure();
            self._bindEvent();
        },
        _bindParam: function(o){//配置参数
            var self = this;
            self.load = (typeof o.load == 'undefined' || o.load == null || typeof o.load != 'function') ? false : o.load;
            self.colCount = (typeof o.colCount == 'undefined' || o.colCount == null) ? false : parseInt(o.colCount);
            self.colWidth = (typeof o.colWidth == 'undefined' || o.colWidth == null) ? false : parseInt(o.colWidth);
            if(!(self.load && self.colCount && self.colWidth)){
                alert('param error!');
                return; 
            }
        },
        _bindStructure: function(){//渲染几列结构
            var self = this;
            var conWidth = D.width(self.container);
            var marginValue = parseInt((conWidth - self.colWidth*self.colCount)/(self.colCount - 1));
            marginValue = marginValue >= 0? marginValue : 0;
            var structure = '';
            for(var i = 0; i < self.colCount; i++){
                if(i == self.colCount - 1){
                    structure += '<div class="J_brook" style="float:left;width:'+ self.colWidth +'px;"></div>'
                }else{
                    structure += '<div class="J_brook" style="float:left;margin-right:'+ marginValue +'px;width:'+ self.colWidth +'px;"></div>';
                }
            }
            D.append(D.create(structure), self.container);
        },
        isGetBottom: function(){//判断是否滚动条达到底部临界点
            /********************   
            * 取窗口滚动条高度    
            ******************/    
            function getScrollTop(){     
                var scrollTop=0;     
                if(document.documentElement&&document.documentElement.scrollTop){     
                    scrollTop=document.documentElement.scrollTop;     
                }else if(document.body){     
                    scrollTop=document.body.scrollTop;     
                }     
                return scrollTop;     
            }     
            /********************   
            * 取窗口可视范围的高度    
            *******************/    
            function getClientHeight(){     
                var clientHeight=0;     
                if(document.body.clientHeight&&document.documentElement.clientHeight){     
                    var clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;             
                }else{     
                    var clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;         
                }     
                return clientHeight;     
            }     
                
            /********************   
            * 取文档内容实际高度    
            *******************/    
            function getScrollHeight(){ 
                return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);     
            }
            if(getScrollTop()+getClientHeight() >= getScrollHeight() - 400){
                return true;
            }     
            return false;
        },
        success: function(items, container){//把一次请求来的多项依次渲染
            function getShortBrook(){//获取最小溪流
                var sBrook;
                var brooks = D.query(container+' .J_brook');
                for(var i = 0; i < brooks.length; i++){
                    if(!sBrook){
                        sBrook = brooks[i];
                    }else if(D.height(brooks[i]) < D.height(sBrook)){
                        sBrook = brooks[i];
                    }
                }
                return sBrook;
            }
            function showItems(items){
                var num = 0,maxNum = items.length;
                showItem(items,num);
                function showItem(items, num){
                    function delay(items, num){
                        return function(){
                            var con = getShortBrook();
                            D.css(items[num], 'opacity', '0');
                            D.append(items[num], con);
                            new S.Anim(items[num] , {'opacity' : '1'} , 2 , 'easeOut').run();
                            num++;
                            if(num < maxNum){
                                showItem(items, num);
                            }
                            if(items[num-1] == items[num]){
                                alert('error')
                            }
                        }
                    }
                    var dl = setTimeout(delay(items, num), 0);
                }
            }
            showItems(items);
        },
        end: function(){//停止异步请求
            window.isEnd = true;
            E.remove(window, 'scroll');
        },
        _bindEvent: function(){//绑定事件
            var self = this;
            E.on(window, 'scroll', function(e){
                if(!self.isGetBottom())return;//滚动条未达到页尾则返回
                self.load(self.success, self.end);
                E.remove(window, 'scroll');
                setTimeout(function(){
                    self._bindEvent();
                },2000);
                
            });
            self.load(self.success, self.end);
        }
   });
   S.Waterfall = Waterfall;
   return Waterfall;
});
       