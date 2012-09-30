/**
 * �������
 * @fileoverview ���õ������
 */
KISSY.add("widgets/PopWin/PopWin",function(S, D, E, UA){
	var IE = UA.ie, startTop;
	
	/**
	 * ����������ṩ�¼���show,hide
	 * @class
	 * @name PopWin
	 * @constructor
	 * @param {Array} size �����ߴ�
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
		 * ���ڳߴ�
		 * @field
		 * @name PopWin#size
		 * @type {Array}
		 */
		self.size = size || [300, 200];
		self.config =S.mix({},config);
		/**
		 * ���ڶ���
		 * @field
		 * @name PopWin#box
		 * @type {HTML Element}
		 */
		//self.box
		/**
		 * ���ڶ����е�����
		 * @field
		 * @name PopWin#boxcontent
		 * @type {HTML Element}
		 */
		//self.boxcontent
		/**
		 * ��������
		 * @field
		 * @name PopWin#popBoxMask
		 * @type {HTML Element}
		 */
		//self.popBoxMask
		//ȫ�����ֲ�
		//window.J_popBoxMask
		
		self.init();		
	}

	PopWin.prototype = {
		/**
		 * ��ʼ����������
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
		 * ��������
		 * @function
		 * @name PopWin#buildMask
		 * @private
		 */
		buildMask: function() {
			var self = this,timeout;
			/*
			 * shiming�޸�
			 * ������ҳ���Ѿ���ʼ��һ������ʱ����ҳ��ʹ��slideshow�����
			 * ����mask������������޷��ı�
			if (!window.__popBoxMask) {
				//����һ������
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
		 * ��ʾ���ֲ�
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
		 * �������ֲ�
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
		 * ɾ�����ֲ�
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
		 * ����������
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
		 * ����λ��
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
		 * ��ʾ���ڣ�����show�¼�
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
		 * ���ش��ڣ�����hide�¼�
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
		 * ɾ������
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
		 * �첽�������
		 * @function
		 * @name PopWin#fillContent
		 * @param {String} html ��������
		 * @param {Function} callback ��������
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
		 * �������
		 * @function
		 * @name PopWin#setContent
		 * @param {String} data ��������
		 */
		setContent: function(data) {
			var self = this;
			self.boxcontent.innerHTML = data;
			self.boxcontent.style.background="#fff"
		},
		/**
		 * ���ô�С
		 * @function
		 * @name PopWin#setSize
		 * @param {Array} size ���
		 */
		setSize:function(size,anim){
			var self = this;
			self.size = size;
			self.setPos(anim);
		}
	}
	/**
	 * ģ��confirm
	 * @function
	 * @name PopWin.confirm
	 * @example
	 * <pre>
	 * KISSY.use("popwin",function(S){
	 * 	S.PopWin.confirm("Ҫ��ʾ������"��function(){
	 * 		//do something...
	 * 	})
	 * })
	 * </pre>
	 * @param {String} msg Ҫ��ʾ����Ϣ
	 * @param {Function} callback ��ȷ��ʱ�����ĺ���
	 * @param {Function} cancelfn ��ȡ��ʱ�����ĺ���
	 * @static
	 */
	PopWin.confirm = function(msg,callback,cancelfn){
		var pop = new PopWin([360,120]),
		html = ['<div class="pop-confirm"><div class="msg">',msg,'</div><div class="op"><a href="#" class="nor-btn J_sure">ȷ��</a> <a href="#" class="nor-btn J_cancel">ȡ��</a></div></div>'].join('');
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
	 * ģ��alert
	 * @function
	 * @name PopWin.alert
	 * @example
	 * <pre>
	 * KISSY.use("popwin",function(S){
	 * 	S.PopWin.alert("Ҫ��ʾ������"��function(){
	 * 		//do something...
	 * 	})
	 * })
	 * </pre>
	 * @param {String} msg Ҫ��ʾ����Ϣ
	 * @param {Function} callback ��ȷ��ʱ�����ĺ���
	 * @static
	 */
	PopWin.alert = function(msg,callback){
		var pop = new PopWin([360,120]),
		html = ['<div class="pop-alert"><div class="msg">',msg,'</div><div class="op"><a href="#" class="nor-btn J_sure">ȷ��</a></div></div>'].join('');
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
	 * �Զ������ݵ�����
	 * @funciton
	 * @name PopWin.customMsg
	 * @example
	 * <pre>
	 * KISSY.use("popwin",function(S){
	 *	var config = {
	 *		size: [360,120],		 // ���ڴ�С
	 *		html: '<div>...</div>',  				 // Ҫ��ʾ��html����
	 *		datas: [{
	 *			className: '.test',  // Ҫ����Ԫ�ص�class����(ǰ���".")
	 *			eventName: 'click',  // Ԫ����Ҫ�������¼�����
	 *			callback: function(e, win) {  // Ԫ�ر�������Ļص�����
	 *				e.halt();
	 *              // do something
	 *				win.hide();
	 *			}
	 *		}]
	 *	}
	 *	S.PopWin.customMsg(config);
	 * }
	 * </pre>
	 * @param {Object} config ��������
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
