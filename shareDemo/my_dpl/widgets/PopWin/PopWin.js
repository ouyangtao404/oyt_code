/**
 * 弹窗组件
 * @fileoverview 公用弹窗组件
 */
KISSY.add("widgets/PopWin/PopWin",function(S, D, E, UA){
	var IE = UA.ie, startTop;
	
	/**
	 * 弹窗组件，提供事件：show,hide
	 * @class
	 * @name PopWin
	 * @constructor
	 * @param {Array} size 弹窗尺寸
	 * @example
	 * <pre>
	 * KISSY.use("popwin",function(S){
	 *   var pop = new S.PopWin([100,200]);
	 *   pop.show();
	 * })
	 * </pre>
	 */
	function PopWin(size,config) {
		var self = this;
		/**
		 * 窗口尺寸
		 * @field
		 * @name PopWin#size
		 * @type {Array}
		 */
		self.size = size || [300, 200];
		self.config =S.mix({},config);
		/**
		 * 窗口对象
		 * @field
		 * @name PopWin#box
		 * @type {HTML Element}
		 */
		//self.box
		/**
		 * 窗口对象中的内容
		 * @field
		 * @name PopWin#boxcontent
		 * @type {HTML Element}
		 */
		//self.boxcontent
		/**
		 * 窗口遮罩
		 * @field
		 * @name PopWin#popBoxMask
		 * @type {HTML Element}
		 */
		//self.popBoxMask
		//全局遮罩层
		//window.J_popBoxMask
		
		self.init();		
	}

	PopWin.prototype = {
		/**
		 * 初始化弹窗对象
		 * @function
		 * @name PopWin#init
		 * @private
		 */
		init: function() {
			var self = this;
			self.buildMask();
			self.buildBox();
			self.fire("init");
		},
		/**
		 * 建立遮罩
		 * @function
		 * @name PopWin#buildMask
		 * @private
		 */
		buildMask: function() {
			var self = this,timeout;
			/*
			 * shiming修改
			 * 解决如果页面已经初始化一个弹窗时，在页面使用slideshow组件，
			 * 监听mask点击，上下文无法改变
			if (!window.__popBoxMask) {
				//建立一个遮罩
				window.__popBoxMask = D.create('<div id="J_popBoxMask"></div>');

				D.css(__popBoxMask,{
					width:D.docWidth() +'px',
					height:D.viewportHeight() + 500 +'px',
					top: '-200px'
				});
				D.get("body").appendChild(__popBoxMask);
			}
			self.popBoxMask = window.__popBoxMask;
			*/
			self.popBoxMask = D.create('<div class="J_popBoxMask"></div>');
			D.css(self.popBoxMask,{
				width:D.docWidth() +'px',
				height:D.viewportHeight() + 500 +'px',
				top: '-200px'
			});
			D.get("body").appendChild(self.popBoxMask);
			self.resizeMaskEv = function() {
				clearTimeout(timeout);
				timeout = setTimeout(function(){
					self.popBoxMask&&S.one(self.popBoxMask).css("width", D.docWidth() +'px');
				},200)
			}
			E.on(window,"resize", self.resizeMaskEv);
			
		},
		/**
		 * 显示遮罩层
		 * @function
		 * @name PopWin#showMask
		 */
		showMask:function(){
			var self = this;
			D.show(self.popBoxMask);
			var html = D.get('html');
			self.htmltop = html.scrollTop;
			html.scrollTop = self.htmltop;
		},
		/**
		 * 隐藏遮罩层
		 * @function
		 * @name PopWin#hideMask
		 */
		hideMask: function() {
			var self = this;
			D.hide(self.popBoxMask)

			var html = D.get('html');
			html.scrollTop = this.htmltop;
		},
		/**
		 * 删除遮罩层
		 * @function
		 * @name PopWin#removeMask
		 */
		removeMask: function() {
			var self = this;
			D.remove(self.popBoxMask)
			//self.popBoxMask=window.__popBoxMask=null;
			self.popBoxMask = null;
			var html = D.get('html');
			
			html.scrollTop = this.htmltop;
		},
		/**
		 * 建立弹出层
		 * @function
		 * @name PopWin#buildBox
		 */
		buildBox: function() {
			var self = this,timeout;
			self.box = D.create('<div class="J_popBoxWrap"><div class="J_popBoxWrapContent"></div><iframe frameborder="0" src="javascript:false" class="shim"/></div>');
			self.boxcontent = D.get(".J_popBoxWrapContent",self.box)
			self.setPos();
			self.scrollSetPos = function() {
					self.setPos();
			}
			E.on(window, "scroll", self.scrollSetPos);
			self.resizeSetPos = function() {
				clearTimeout(timeout);
				timeout = setTimeout(function(){
					self.setPos();
				},200)
			}
			E.on(window, "resize", self.resizeSetPos);
			D.get("body").appendChild(self.box);
		},
		/**
		 * 计算位置
		 * @function
		 * @name PopWin#setPos
		 */
		setPos: function(anim) {
			var self = this, w = self.size[0], h = self.size[1], winw = D.viewportWidth(), winh = D.viewportHeight(), scrTop = D.scrollTop(), top = scrTop + (winh - h) / 2, left = (winw - w) / 2;
			var boxleft = left - 2 + "px",
			boxtop = (self.config.top)?((800 - h) / 2 + "px"):(top - 2 + "px"),
			boxwidth =  w + "px",
			boxheight =  h + "px";
			if (!anim) {
				D.css(self.box, "left", boxleft);
				D.css(self.box, "top", boxtop);
				D.css(self.box, "width",boxwidth);
				D.css(self.boxcontent, "height",boxheight);
				
				D.css(self.popBoxMask, 'top', D.scrollTop()- 200 + 'px');
			}else {
				S.Anim(self.box,{
					left:boxleft,
					top:boxtop,
					width:boxwidth
				},0.3,"easeOut").run();
				S.Anim(self.boxcontent,{
						height:boxheight
					},0.3,"easeOut").run();
			}
		},
		/**
		 * 显示窗口，触发show事件
		 * @function
		 * @name  PopWin#show
		 */
		show: function() {
			var self = this;
			D.show(self.box);
			self.showMask();
			self.fire("show");
			startTop = D.scrollTop();
		},
		/**
		 * 隐藏窗口，触发hide事件
		 * @function
		 * @name  PopWin#hide
		 */
		hide: function() {
			var self = this;
			D.hide(self.box);
			self.hideMask();
			self.fire("hide");
		},
		/**
		 * 删除窗口
		 * @function
		 * @name  PopWin#remove
		 */
		remove: function() {
			var self = this;
			D.remove(self.box);
			self.box = null;
			self.removeMask();
			E.remove(window,"scroll",self.scrollSetPos);
			E.remove(window,"resize",self.resizeSetPos);
			E.remove(window,"resize",self.resizeMaskEv);
		},
		/**
		 * 异步填充内容
		 * @function
		 * @name PopWin#fillContent
		 * @param {String} html 填充的内容
		 * @param {Function} callback 其它操作
		 */
		fillContent: function(url, callback) {
			var self = this;
			url = url.indexOf("?")==-1?(url+"?t="+new Date().getTime()):(url+"&t="+new Date().getTime());
			self.boxcontent.style.background=""
			S.io.get(url, function(data, textStatus, xhr) {
				self.setContent(data);

				if (callback)
					callback();
			});
		},
		/**
		 * 填充内容
		 * @function
		 * @name PopWin#setContent
		 * @param {String} data 填充的内容
		 */
		setContent: function(data) {
			var self = this;
			self.boxcontent.innerHTML = data;
			self.boxcontent.style.background="#fff"
		},
		/**
		 * 设置大小
		 * @function
		 * @name PopWin#setSize
		 * @param {Array} size 宽高
		 */
		setSize:function(size,anim){
			var self = this;
			self.size = size;
			self.setPos(anim);
		}
	}
	/**
	 * 模拟confirm
	 * @function
	 * @name PopWin.confirm
	 * @example
	 * <pre>
	 * KISSY.use("popwin",function(S){
	 * 	S.PopWin.confirm("要显示的文字"，function(){
	 * 		//do something...
	 * 	})
	 * })
	 * </pre>
	 * @param {String} msg 要显示的消息
	 * @param {Function} callback 点确定时触发的函数
	 * @param {Function} cancelfn 点取消时触发的函数
	 * @static
	 */
	PopWin.confirm = function(msg,callback,cancelfn){
		var pop = new PopWin([360,120]),
		html = ['<div class="pop-confirm"><div class="msg">',msg,'</div><div class="op"><a href="#" class="nor-btn J_sure">确认</a> <a href="#" class="nor-btn J_cancel">取消</a></div></div>'].join('');
		pop.setContent(html);
		var sureBtn = D.get(".J_sure",pop.boxcontent),
		cancelBtn = D.get(".J_cancel",pop.boxcontent);
		setTimeout(function(){
			pop.show();	
			pop.size[1] = 130+D.height(D.get(".msg",pop.boxcontent));
			pop.setPos();
			
		},0);
		E.on(sureBtn,"click",function(e){
			e.halt();
			pop.remove();
			callback&&callback.call(this);
		});
		E.on(cancelBtn,"click",function(e){
			e.halt();
			pop.remove();
			cancelfn&&cancelfn.call(this);
		});
	}
	/**
	 * 模拟alert
	 * @function
	 * @name PopWin.alert
	 * @example
	 * <pre>
	 * KISSY.use("popwin",function(S){
	 * 	S.PopWin.alert("要显示的文字"，function(){
	 * 		//do something...
	 * 	})
	 * })
	 * </pre>
	 * @param {String} msg 要显示的消息
	 * @param {Function} callback 点确定时触发的函数
	 * @static
	 */
	PopWin.alert = function(msg,callback){
		var pop = new PopWin([360,120]),
		html = ['<div class="pop-alert"><div class="msg">',msg,'</div><div class="op"><a href="#" class="nor-btn J_sure">确定</a></div></div>'].join('');
		pop.setContent(html);
		var sureBtn = D.get(".J_sure",pop.boxcontent),
		cancelBtn = D.get(".J_cancel",pop.boxcontent);
		setTimeout(function(){
			pop.show();	
			pop.size[1] = 130+D.height(D.get(".msg",pop.boxcontent));
			pop.setPos();
			
		},0);
		
		E.on(sureBtn,"click",function(e){
			e.halt();
			pop.remove();
			callback&&callback.call(this);
		});
		
		return pop;
	}
	
	/**
	 * 自定义内容弹出窗
	 * @funciton
	 * @name PopWin.customMsg
	 * @example
	 * <pre>
	 * KISSY.use("popwin",function(S){
	 *	var config = {
	 *		size: [360,120],		 // 窗口大小
	 *		html: '<div>...</div>',  				 // 要显示的html内容
	 *		datas: [{
	 *			className: '.test',  // 要操作元素的class名称(前面加".")
	 *			eventName: 'click',  // 元素需要触发的事件名称
	 *			callback: function(e, win) {  // 元素被出发后的回调函数
	 *				e.halt();
	 *              // do something
	 *				win.hide();
	 *			}
	 *		}]
	 *	}
	 *	S.PopWin.customMsg(config);
	 * }
	 * </pre>
	 * @param {Object} config 配置内容
	 */
	PopWin.customMsg= function(config) {
		var size = config.size, html = config.html, datas = config.datas;
		var pop = new PopWin(size);
		pop.setContent(html);
		
		setTimeout(function(){
			pop.show();	
			pop.setPos();
		},0);
		
		S.each(datas, function(data) {
			var elClass = data.className;
			var callback = data.callback;
			var eventName = data.eventName;
			E.on(elClass, eventName, function(e) {
				if (!!callback && callback != undefined) 
					callback(e, pop);
			});
		});
		return pop;
	}
	
	S.augment(PopWin, S.EventTarget);
	return PopWin;
},{
    requires:['dom','event','ua','./PopWin.css']
});
