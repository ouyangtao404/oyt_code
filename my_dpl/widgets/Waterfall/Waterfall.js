/**
 * intervein elements dynamically
 * @author baohe.oyt@taobao.com
 */
KISSY.add("widgets/Waterfall/Waterfall", function(S) {
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
            S.log('请配置正确的id.');
            return;
        }
        self._init(config || {});
    }
    
    S.augment(Waterfall, {
        _init: function(config) {
            var self = this;
            self.isEnd = false;
            self._bindParam(config);
            
            if(!config.brooks){
                self._bindStructure();
            }
            self._bindEvent();
            //初始化一个工具给self.imgReady;
            self.imgReady = self._checkImgSizeInit();
        },
        //配置参数
        _bindParam: function(o) {
            var self = this,
                brooks,
                basicHeight = [];
            
            self.load = (typeof o.load == 'undefined' || o.load == null || typeof o.load != 'function') ? false : o.load;
            self.insertBefore = (typeof o.insertBefore == 'undefined' || o.insertBefore == null || typeof o.insertBefore != 'function') ? false : o.insertBefore;
            self.insertAfter = (typeof o.insertAfter == 'undefined' || o.insertAfter == null || typeof o.insertAfter != 'function') ? false : o.insertAfter;
            self.itemComplete = (typeof o.itemComplete == 'undefined' || o.itemComplete == null || typeof o.itemComplete != 'function') ? false : o.itemComplete;
            self.renderComplete = (typeof o.renderComplete == 'undefined' || o.renderComplete == null || typeof o.renderComplete != 'function') ? false : o.renderComplete;
            self.brooks = brooks = o.brooks;
            
            var len = brooks.length;
            for(var i=0; i<len; i++) {
                basicHeight.push(D.offset(brooks[i]).top);
            }
            self.basicHeight = (typeof o.basicHeight == 'undefined' || o.basicHeight == null || typeof o.basicHeight != 'object')? basicHeight : o.basicHeight;
            self.imageClass = (typeof o.imageClass == 'undefined' || o.imageClass == null || typeof o.imageClass != 'string')? false : o.imageClass;
            self.brookName = (typeof o.brookName == 'undefined' || o.brookName == null || typeof o.brookName != 'string')? BROOK_NAME : o.brookName;
            //如果已经预设了结构，则不需要其他参数
            if(o.brooks){
                return;
            }
            
            self.colCount = (typeof o.colCount == 'undefined' || o.colCount == null) ? false : parseInt(o.colCount);
            self.colWidth = (typeof o.colWidth == 'undefined' || o.colWidth == null) ? false : parseInt(o.colWidth);
            if(!(self.load && self.colCount && self.colWidth)){
                alert('param error!');
                return; 
            }
        },
        /**
         * 初始化一个函数，用于计算图片尺寸
         * 这里把返回的对象赋值给self.imgReady 
         */
        _checkImgSizeInit: function() {
            var self = this,
                list = [], 
                intervalId = null,

            // 用来执行队列
            tick = function () {
                var i = 0;
                for (; i < list.length; i++) {
                  list[i].end ? list.splice(i--, 1) : list[i]();
                };
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
                };
                width = img.width;
                height = img.height;
                // 加载错误后的事件
                img.onerror = function () {
                    error && error.call(img);
                    onready.end = true;
                    img = img.onload = img.onerror = null;
                };
            
                // 图片尺寸就绪
                onready = function () {
                  newWidth = img.width;
                  newHeight = img.height;
                  if (newWidth !== width || newHeight !== height ||
                    // 如果图片已经在其他地方加载可使用面积检测
                    newWidth * newHeight > 1024
                  ) {
                    ready.call(img);
                    onready.end = true;
                  };
                };
                onready();
            
                // 完全加载完毕的事件
                img.onload = function () {
                    // onload在定时器时间差范围内可能比onready快
                    // 这里进行检查并保证onready优先执行
                    !onready.end && onready();
                    load && load.call(img);
                    // IE gif动画会循环执行onload，置空onload即可
                    img = img.onload = img.onerror = null;
                };
            
                // 加入队列中定期执行
                if (!onready.end) {
                    list.push(onready);
                    // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                    if (intervalId === null) intervalId = setInterval(tick, 40);
                }
            };
        },

        //渲染几列结构
        _bindStructure: function(){
            var self = this,
                structure = '',
                conWidth = D.width(self.container),
                marginValue = parseInt((conWidth - self.colWidth*self.colCount)/(self.colCount - 1));
            
            marginValue = marginValue >= 0? marginValue : 0;
            
            for(var i = 0; i < self.colCount; i++){
                if(i == self.colCount - 1){
                    structure += '<div class="'+ self.brookName +'" style="float:left;width:'+ self.colWidth +'px;"></div>'
                }else{
                    structure += '<div class="'+ self.brookName +'" style="float:left;margin-right:'+ marginValue +'px;width:'+ self.colWidth +'px;"></div>';
                }
            }
            D.append(D.create(structure), self.container);
            self.brooks = D.query('.'+self.brookName, self.container);
        },
        //判断是否滚动条达到底部临界点
        isGetBottom: function(){
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
        /**
         * 获取高度最小溪流
         */
        getShortBrook: function() {
            var self = this,
                sBrook,
                bh = self.basicHeight,
                brooks = self.brooks,
                len = brooks.length;
                
            if(bh.length === 0){
                for(var j=0; j < len; j++){
                    bh[j] = 0;
                }
            }
            for(var i = 0; i < len; i++){
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
        /**
         * /把一次请求来的多项依次渲染
         * 实现瀑布流渲染完成的回调函数的原理：
         *      1.判断isLastTime参数是否为真
         *      2.如果1满足，则在每次渲染items成员时，给addNum加1，并判断是否addNum等于sumNum，为真则执行瀑布流渲染完成回调
         * 这么实现的原因是每次渲染都是一个异步的过程，不确定哪一个item会是最后渲染完成，所以计数来判断才靠谱
         */
        success: function(items, isLastTime) {
            var self = this,
                sumNum = items.length,
                addNum = 0;
            
            if(items.length === 0)return;
            showItems(items);
            function showItems(items){
                var num = 0,
                    maxNum = items.length;
                    
                showItem(items, num);
                function showItem(items, num){
                    
                    function delay(items, num){
                        return function(){
                        	var	image = D.get('.' + self.imageClass, items[num]);
                        	D.css(items[num], 'opacity', '0');	
                    		if(image){//有图片
                    			self.imgReady(items[num], D.attr(image, 'src'), function() {
                            		renderStart({
                            			img: this,
                            			item: false
                            		}, num, maxNum);
                            	});
                            	return;
                    		}
                    		if(!items[num])debugger;
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
		        	} else if(obj.item) {
		        		var item = obj.item,
		        			imgData = {
		        				isHasImg: false,
			        			height: 0,
			        			width : 0
		        			};
		        	} else {
		        		throw new Error('renderStart error!');
		        	}
		        	//插入前回调
		        	if(self.insertBefore) self.insertBefore.call(item, imgData);
		            //插入后回调
		            D.append(items[num], con);
		            if(self.insertAfter) self.insertAfter.call(item, imgData);
		            
		            new S.Anim(items[num] , {'opacity' : '1'} , 2 , 'easeOut', function() {
		            	if(self.itemComplete) self.itemComplete.apply(item, imgData);
		            	addNum++;
		            	if(isLastTime && self.renderComplete && addNum === sumNum){
		            	    self.renderComplete.apply(self);
		            	}
		            }).run();
		            num++;
		            if(num < maxNum){
		                showItem(items, num);
		                //重复插入报错
		                if(items[num-1] === items[num]){
		                	alert('error');
		            	}
		            }
		            
		    	}
            }
            
        },
        //停止异步请求
        end: function(){
            var self = this;
            
            self.isEnd = true;
            //console.log('end');
            E.remove(window, 'scroll', self.scrollFn);
            //结束后清理延迟函数，待优化
            //clearTimeout(timer);
        },
        /**
         * end之后重新开始渲染，如翻页效果
         */
        /*
        restart: function() {
            var self = this,
                brooks = self.brooks,
                len = brooks.length;
            //确定已经结束
            if(!self.isEnd){
                self.end();
            }
            
            self.isEnd = true;
            //重新取一下小溪流，当list模式切换之后，会有新的，重新取保险
            self.brooks = D.query('.'+ self.brookName);
            //清空小溪流内容
            for(var i=0; i<len; i++) {
                D.html(brooks[i], '');
            }
            self._bindEvent();
        },
        */
        //绑定事件
        _bindEvent: function(){
            var self = this;
            self.scrollFn = function(){
                if(!self.isGetBottom())return;//滚动条未达到页尾则返回
                self.load(self.success, self.end, self);
            }
            E.on(window, 'scroll', self.scrollFn);
            self.load(self.success, self.end, self);
        }
    });
    S.Waterfall = Waterfall;
    return Waterfall;
});
       