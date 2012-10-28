/**
* Waterfall.js | 瀑布流组件
* @author baohe.oyt@taobao.com
* @class Waterfall
* @param { object } 配置项
* @return { object } 生成一个Waterfall实例
* @depends kissy 1.2.0, template
*
* S.Waterfall：
* 说明：瀑布流组件，通过new S.Waterfall 或者 new Waterfall来创建一个瀑布流,对于数据的限制，
* 只需要给实例的success方法传入新创建的dom节点集合便可，success函数也可以由load函数的第一个参数来获取
* 执行实例的end函数，才能停止瀑布流的继续渲染（机制是清除对滚动条到底部的相关监听函数）
* 使用： new Waterfall(container, options);
* 配置：（brooks和（colCount,colWidth），必须配置其中一个）
* brooks:{object} 指定几个容器，没有的话，需要组件会在容器里自动创建
* brookName:{string} 瀑布流每列的class，默认为'J_plaza_brook'
* colCount:{number} 瀑布流列数,若已经有制定的列容器则不用填
* colWidth:{number} 每列宽度,若已经有制定的列容器则不用填
* imageClass:{string} 瀑布流item的图片的class，用于有大图的item操作img元素
* load:{function} 需要传入2个参数，
dataList{array} 数据集合
isLastTime{boolean} 为true时表示最后一次渲染数据,用于触发renderComplete事件的标记
* callback:{object}
* 支持的成员为：
{
ready: {function} 组件的基本配置完成后触发，回调函数里建议调用组件的load函数开始渲染数据
insertBefore：{function} 每个item插入之前触发，this为该item，唯一的参数是该item的大图信息，如下
*@example:
*{
* isHasImg: false/true,有无图片，以及尺寸，无图片尺寸为0
* height: 100,
* width : 200
*};
insertAfter:{function} 每个item插入之后触发，this,还有传入参数insetAfter
itemComplete:{function} 每个item显示完整（渐隐显示）后触发，this为该item
}

* 事件支持：
* scrollToEnd: 浏览到底部触发，用于触发的时候渲染新的数据（与ready类似，在监听函数中，调用load渲染数据）
* renderComplete: 所有信息渲染完成（以实例的属性isLastTime为标记）后触发
*/

/**=====================================================
 * 改进的方面：
 * 	1.有固定的编码风格和习惯（操作符前后都有空格，函数的括号里的参数的逗号都买都有空格，等）
 *  2.使用性能更好的一些方式（）
 * 
 * 不会把内部的变量
 * 还存在的一些问题：
 * 	1.有部分参考别处的代码的地方，没有统一编码格式
 *  2.还是缺少必要的注释
 *  3.接口的设计，没有很好的站在用户的角度，详情可参照初始化的入口；
 * 
 =====================================================*/
KISSY.add('widgets/Waterfall/Waterfall', function(S, Template) {
    var D = S.DOM,
        E = S.Event,
        UA = S.UA,
        timer,
        BROOK_NAME = 'J_plaza_brook';
    
    function Waterfall(container, config) {
        var self = this;
        
        if(S.isString(container)) {
            self.container = D.get(container);
        }
        if(!container && config.brooks) {
        	/**=====================================================
			 * 改进的方面：
			 * 	使用规范的提示方式
			 =====================================================*/
            console.info('请配置正确的id.');
            return;
        }
        self._init(config || {});
    }
    //继承base可以设置自定义事件
    S.extend(Waterfall, S.Base);

    S.augment(Waterfall, {
        _init: function(config) {
            var self = this;
            
            self.isEnd = false;
            self._bindParam(config);
            //初始化一个工具给self.imgReady;
            self.imgReady = self._checkImgSizeInit();
            self._bindEvent();
        },
        //配置参数
        _bindParam: function(o) {
            var self = this,
                brooks;
			/** ====================================================
			 * 有必要的注释
			  ====================================================*/
			
            //必须有的参数，没有配置到需要报错
            //指定的溪流 且 构建溪流的3要素（容器，溪流宽度，溪流列数）都没有
            if(!o.template || (!o.brooks && (!o.container || !o.colCount || !o.colWidth))) {
                console.info('brooks不存在或container/colCount/colWidth不存在！');
                return;
            }
            if(!o.brooks) {
                self.brooks = o.brooks = self._bindStructure();
            }
            
            /** ====================================================
			 * 初始的设置参数也更新为更为简明有效的方式
			  ====================================================*/
            function setParam(def, key) {
                var v = o[key];
                self[key] = (v === undefined || v === null)? def : v;
            }
            
            S.each({
                brookName: BROOK_NAME,
                brooks: false,
                colCount: false,
                colWidth: false,
                imageClass: false,
                template: false,
                index: 0,//触发渲染次数
                callback: false
            }, setParam);
            
            // 获取系列的基本高度
            function getBasicHeight() {
                var brooks = self.brooks,
                    len = brooks.length,
                    heightList = [];
                    
                for(var i=0; i<len; i++) {
                	 /** ====================================================
					 * 使用性能更好的一些方式实现
					  ====================================================*/
                    heightList[heightList.length] = D.offset(brooks[i]).top;
                }
                return heightList;
            }
            self.basicHeight = getBasicHeight();
        },
        /**
		* 初始化一个函数，用于计算图片尺寸
		* 这里把返回的对象赋值给self.imgReady
		*/
        _checkImgSizeInit: function() {
        	 /** ====================================================
			 * 对闭包的理解和使用
			  ====================================================*/
            var self = this,
                list = [],
                intervalId = null,

                // 用来执行队列
                tick = function () {
                    var i = 0;
                    for (; i < list.length; i++) {
                      list[i].end ? list.splice(i--, 1) : list[i]();
                    }
                    !list.length && stop();
                },
            
                // 停止所有定时器队列
                stop = function () {
                    clearInterval(intervalId);
                    intervalId = null;
                };
            
            return function (dom, url, ready, load, error) {
                var onready,
                    width,
                    height,
                    newWidth,
                    newHeight,
                    img = new Image();
                    
                img.relayDom = dom;
                img.src = url;
                // 如果图片被缓存，则直接返回缓存数据
                if(img.complete) {
                    ready.call(img);
                    load && load.call(img);
                    return;
                }
                width = img.width;
                height = img.height;
                // 加载错误后的事件
                E.on(img, 'error', function() {
                    error && error.call(img);
                    onready.end = true;
                    img = img.onload = img.onerror = null;
                });
            
                // 图片尺寸就绪
                onready = function() {
                    newWidth = img.width;
                    newHeight = img.height;
                    if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
                        ready.call(img);
                        onready.end = true;
                    };
                }
                onready();
            
                // 完全加载完毕的事件
                E.on(img, 'load', function() {
                    // onload在定时器时间差范围内可能比onready快
                    // 这里进行检查并保证onready优先执行
                    !onready.end && onready();
                    load && load.call(img);
                    // IE gif动画会循环执行onload，置空onload即可
                    img = img.onload = img.onerror = null;
                });
            
                // 加入队列中定期执行
                if (!onready.end) {
                    list.push(onready);
                    // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                    if (intervalId === null) intervalId = setInterval(tick, 40);
                }
            };
        },

        //渲染几列结构
        _bindStructure: function() {
            var self = this,
                structure = '',
                conWidth = D.width(self.container),
                marginValue = parseInt((conWidth - self.colWidth * self.colCount) / (self.colCount - 1));
            
            marginValue = marginValue >= 0? marginValue : 0;
            
            for(var i = 0; i < self.colCount; i++){
                if(i == self.colCount - 1){
                    structure += '<div class="'+ self.brookName +'" style="float:left;width:'+ self.colWidth +'px;"></div>'
                }else{
                    structure += '<div class="'+ self.brookName +'" style="float:left;margin-right:'+ marginValue +'px;width:'+ self.colWidth +'px;"></div>';
                }
            }
            D.append(D.create(structure), self.container);
            return D.query('.'+self.brookName, self.container);
        },
        //判断是否滚动条达到底部临界点
        isGetBottom: function() {
            //取窗口滚动条高度
            function getScrollTop() {
                var scrollTop = 0;
                if(document.documentElement && document.documentElement.scrollTop) {
                    scrollTop = document.documentElement.scrollTop;
                }else if(document.body) {
                    scrollTop = document.body.scrollTop;
                }
                return scrollTop;
            }
            //取窗口可视范围的高度
            function getClientHeight() {
                var clientHeight = 0;
                if(document.body.clientHeight && document.documentElement.clientHeight){
                    var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight)? document.body.clientHeight : document.documentElement.clientHeight;
                }else{
                    var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight)? document.body.clientHeight : document.documentElement.clientHeight;
                }
                return clientHeight;
            }
            //取文档内容实际高度
            function getScrollHeight() {
                return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            }
            if(getScrollTop() + getClientHeight() >= getScrollHeight() - 400) {
                return true;
            }
            return false;
        },
        /**
		* 获取高度最小溪流
		*/
        getShortBrook: function() {
            var self = this,
                sBrook,
                bh = self.basicHeight,
                brooks = self.brooks,
                len = brooks.length;
                
            if (bh.length === 0) {
             /** ====================================================
			 * 使用性能更好的一些方式实现
			 * 这里把长度.length先提出来，在循环的时候，就能提高一些运算
			  ====================================================*/
                for(var j=0; j < len; j++){
                    bh[j] = 0;
                }
            }
            for(var i = 0; i < len; i++) {
                if(!sBrook){
                    sBrook = brooks[i];
                    sBrook.basicHeight = bh[i];
                }else if(D.height(brooks[i]) + bh[i] < D.height(sBrook) + sBrook.basicHeight){
                    sBrook = brooks[i];
                    sBrook.basicHeight = bh[i];
                }
            }
            return sBrook;
        },
         /** ====================================================
		* 代码只做跟自己主题的功能相关的事情，也要把跟代码主题能提炼到内部的来的，尽量写到代码里，不要暴露出去
		* 这里提现的方式就是，将模板和数据的拼合放到组件的内部来，用户在实例化的时候，只要把模板作为参数传入就好了
	     ====================================================*/

        /**
		* 把数据和模板进行拼装
		*/
        _createDom: function(dataList) {
            var self = this,
                items = [],
                template = self.template;
            
            for(var i=0; i < dataList.length; i++) {
                items[items.length] = D.create(S.Template(template).render(dataList[i]));
            }
            return items;
        },
        /**
		* /把一次请求来的多项依次渲染
		* 实现瀑布流渲染完成的回调函数的原理：
		* @param dataList {array} 数据集合，用于和模板拼装成代码块
		* @param isLastTime {boolean} 标志是不是最后一次渲染，需要在dataList.length不为0的时候为true，否则无法触发renderComplete事件
		*/
        load: function(dataList, isLastTime) {
            var self = this;
            
            //已经结束的话直接返回
            if(self.isEnd) {
                console.info('do not execute function load after render is completed!');
                return;
            };
            
            if(dataList.length == 0) {
                if(self.isRenderComplete) {
                    return;
                }
                //传入了空的信息,以瀑布流结束处理
                self.isRenderComplete = true;
                self.end();
                //把触发代码写最后，是因为可能监听函数里有阻塞，导致isRenderComplete置为true不及时，所以放到最后
                self.fire('renderComplete');
                return;
            }
            /**
			* 如果有过正常的触发渲染完成的条件（(dataList.length > 0 && isLastTime)）,isRenderComplete置为真
			* 如下赋值必须在if(self.isRenderComplete)return;的下方，是留给下次load执行的时候用的
			* 写在这个位置而不是在renderComplete触发之后的原因是，如果下方触发fire之后来设置，可能下次的load又开始执行，需要一个及时的标志
			*/
            self.isRenderComplete = (dataList.length > 0 && isLastTime)? true : false;
            
            var items = self._createDom(dataList),
                sumNum = items.length,
                addNum = 0;

            self.index ++;
            showItems(items);
            function showItems(items) {
                var num = 0,
                    maxNum = items.length;
                
                showItem(items, num);
                function showItem(items, num) {
                    function delay(items, num) {
                        return function() {
                            var image = D.get('.' + self.imageClass, items[num]);
                            D.css(items[num], 'opacity', '0');
                            if (image) {//有图片
                                self.imgReady(items[num], D.attr(image, 'src'), function() {
                                    renderStart({
                                        img: this,
                                        item: false
                                    }, num, maxNum);
                                });
                                return;
                            }
                            //无图片
                            renderStart({
                                img: false,
                                item: items[num]
                            }, num, maxNum);
                        }
                    }
                    timer = setTimeout(delay(items, num));
                }
                //obj是那个用于计算图片尺寸生成的img实例
                function renderStart(obj, num) {
                    var con = self.getShortBrook();
                    
                    if(obj.img) {
                        var img = obj.img,
                            item = img.relayDom,
                            imgData = {
                                isHasImg: true,
                                height: img.height,
                                width : img.width
                            };
                    } else if (obj.item) {
                        var item = obj.item,
                            imgData = {
                                isHasImg: false,
                                height: 0,
                                width : 0
                            };
                    } else {
                        console.error('renderStart error!');
                    }
                    //插入前回调
                    if(self.callback.insertBefore) self.callback.insertBefore.call(item, imgData);
                    D.append(items[num], con);
                    //插入后回调
                    if(self.insertAfter) self.insertAfter.call(item, imgData);
                    if(num + 1 === sumNum && isLastTime) {
                        self.fire('renderComplete');
                        console.log('222');
                        self.end();
                    }
                    
                    new S.Anim(items[num] , {'opacity' : '1'} , 2 , 'easeOut', function() {
                        if (self.callback.itemComplete) self.callback.itemComplete.call(item, imgData);
                    }).run();
                    num++;
                    if (num < maxNum) {
                        showItem(items, num);
                        //重复插入报错
                        if(items[num-1] === items[num]){
                            console.error('item repeat!');
                        }
                    }
                    
                }
            }
        },
        //停止异步请求
        end: function() {
            var self = this;
            
            self.isEnd = true;
            E.remove(window, 'scroll', self.scrollFn);
        },
        //绑定事件
        _bindEvent: function() {
            var self = this;
            
            self.scrollFn = function() {
	            if (!self.isGetBottom()) {
	            	return;//滚动条未达到页尾则返回
	            }
                self.fire('scrollToEnd');
            }
            E.on(window, 'scroll', self.scrollFn);
            self.callback.ready.call(self);
        }
    });
    S.Waterfall = Waterfall;
    return Waterfall;
},{
    requires: ['template']
});