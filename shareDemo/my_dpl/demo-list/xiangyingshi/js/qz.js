/*
 * @fileoverview：亲子页中的相关交互实现
 * @author：baohe.oyt
 * @version：1.0
 * @time：2012-2-16
 */
KISSY.app('QZ');
QZ.add('init',function(QZ){
	var S=KISSY,D=S.DOM,E=S.Event,UA=S.UA;
			/*
			 * 存放常用的方法
			 * @name QZ.common
			 */
	QZ.common={
			/*
			 * ajax请求
			 * @name QZ.common#sendRequest
			 * @param{string} _surl 请求地址
			 * @param{function} _callback 回调函数
			 * @param{string} _data 参数 
			 */
			sendRequest:function(_surl,_callback,_data){
					var _hdsuccess= function(o) {
						if(o!==undefined) {
							var result=eval("("+o+")");
							if(result.status&&typeof _callback=="function") {
								_callback(result);
							}
						} else {
							alert("error")
						}
					};
					_surl=_surl+(_surl.indexOf("?")==-1?"?":"&")+"t="+new Date().getTime();
					if(_data) {
						S.io.post(_surl,_data,_hdsuccess);
					} else {
						S.io.get(_surl,_hdsuccess);
					}
			}
		};
	/*
	 * 亲子活动
	 */
	QZ.baby={
		/*
		 * 首页的初始化
		 * @name QZ.baby#init
		 * @param{object} config 配置
		 * function
		 */
		init:function(config){
			var self = this;
			self.commonInit();
			//绑定事件
			self.bindEvent();
			//图片延迟加载
			/*
			S.use('datalazyload',function(S, DataLazyload){
			  	S.ready(function(S) {
		        	S.DataLazyload( { mod: 'manual' } );
		    	});
		   	});
		    */
		},
		/*
		* 详情页的初始化
		* @name QZ.baby#detail_init
		* function
		*/	
		detail_init:function(){
			var self = this;
			self.commonInit();
			//绑定详情页的事件
			self.bindEventDetail();
			//分享到微博、人人
			self.share();

		},
		/*
		* 搜索页的初始化
		* @name QZ.baby#search_init
		* function
		*/	
		search_init:function(){
			var self = this;
			//搜索为空提示 暂时去了
			return this;
		},
		/*
		* 公共初始化内容
		* @name QZ.baby#commonInit
		* function
		*/	
		commonInit:function(){
			document.domain = "taobao.net";
			var self = this;
			//插入遮盖层、对话框、登陆框、等节点；
			self.popLoad();
			//弹出框组件
			S.add('popwin',{
                     fullpath:'http://a.tbcdn.cn/apps/pegasusmyhome/widgets/PopWin/PopWin.js',
                     cssfullpath:'http://a.tbcdn.cn/apps/pegasusmyhome/widgets/PopWin/PopWin.css'
                  });
            //跨域的登录和注册跳转
            if(S.UA.ie == 6){
            	S.use('sizzle',function(e){
            		var loginRegist = D.query('.login-info a');
		            var login  = loginRegist[0];
		            var regist = loginRegist[1];
		            E.on(login,'click',function(e){
		            	var url = window.top.location.href;
		            	window.top.location.href = 'https://login.taobao.com/member/login.jhtml?f=top&redirectURL='+encodeURIComponent(url);
		            });
		            E.on(regist,'click',function(e){
		            	window.top.location.href = 'http://member1.taobao.com/member/new_register.jhtml?from=&ex_info=&ex_sign=';
		            });
            	});
	        }
		},
		/*
		* 首页绑定事件
		* @name QZ.baby#bindEvent
		* function
		*/	
		bindEvent:function(){
			var self = this;
			//事件代理，点击投票按钮执行
			var mainCon = D.get('#J_mainCon');
			E.on(mainCon,'click',function(e){
				var tar = e.target;
				if(D.hasClass(tar,'vote')){
					var unit = D.parent(tar, '.one');
					//发送投票请求
					var sendData =  'babyid='+D.attr(D.get('.babyid',unit),'value')
									+'&_tb_token_='
									+D.attr(D.get('.tb_token',unit),'value');
					var requestUrl = D.attr(D.get('#requestUrl'),'value');
					QZ.common.sendRequest(requestUrl,function(data){
						//若返回正确状态则执行+1的动画
						if(data.status == '1'||data.status == 1){
							self.voitAddAnim(unit,D.get('#addOne'));	
						}else{
							self.voitFail(data);	
						}
					},sendData);
				}
			});
			//ie6下，hover
			if(S.UA.ie == 6){
				E.on(D.query('.i-box',mainCon),'mouseenter',function(e){
				var tar = e.currentTarget;
				if(!D.hasClass(tar,'active')){
					D.addClass(tar,'active');
				}
				});
				E.on(D.query('.i-box',mainCon),'mouseleave',function(e){
					var tar = e.currentTarget;
					if(D.hasClass(tar,'active')){
						D.removeClass(tar,'active');
					}
				});
			}
		},
		/*
		* 详情页绑定事件
		* @name QZ.baby#bindEventDetail
		* function
		*/	
		bindEventDetail:function(requestUrl){
			var self = this;
			var voteButton = D.get('#J_vote');
			E.on(voteButton,'click',function(e){
				
					//发送投票请求
					var sendData = 'babyid='+D.attr(D.get('#J_babyid'),'value')
									+'&_tb_token_='
									+D.attr(D.get('.tb_token'),'value');
					var requestUrl = D.attr(D.get('#requestUrl'),'value');
					QZ.common.sendRequest(requestUrl,function(data){
						//若返回正确状态则执行+1的动画
						if(data.status == '1'||data.status == 1){
							self.voitAddAnim(e.currentTarget,D.get('#addOne'),'#J_vote',{x:165,y:0});
							//修改排名
							D.get('#J_ord').innerHTML = data.rank;
						}else{
							self.voitFail(data);	
						}
					},sendData);
			});
		},
		/*
		* 分享(新浪、人人、QQ空间、淘江湖)
		* @name QZ.baby#share
		* function
		*/	
		share:function(){
				var shareObject = {
					'taobao' : 'http://share.jianghu.taobao.com/share/addShare.htm?url={link}&title={title}&pic={pic}',
					'qzone' : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={link}&title={title}&pic={pic}',
					'renren' : 'http://share.renren.com/share/buttonshare.do?link={link}&title={title}&pic={pic}',
					'kaixin' : 'http://www.kaixin001.com/repaste/share.php?rtitle={title}&rurl={link}&pic={pic}',
					'douban' : 'http://www.douban.com/recommend/?url={link}&title={title}&pic={pic}',
					'sina' : 'http://service.t.sina.com.cn/share/share.php?url={link}&appkey=&title={title}&pic={pic}&ralateUid='
				},
				shareUrl = function (type,data) {
					var flag = type == 'taobao' ? true : false , url = shareObject[type];
					for(var key in data) {
						try {
							var t = flag&&key=="title" ? data[key]: encodeURIComponent(data[key]);
							url = url.replace('{' + key + '}', t || "");
						} catch (e) {
						}
					}
					return url;
				};
				function Share(doms,options) {
					if(!(this instanceof Share)) {
						return new Share(doms,options);
					}
					this._init.apply(this,arguments);
				}

				Share.prototype = {
					_init : function( doms , options , callback ) {
						var self = this;
						self.opts = {
							title : document.title,
							link : window.location.href,
							pic : ''
						}
						self.update(options);
						S.each(doms, function(item) {
							E.on(item,'click', function(ev) {
								ev.halt();
								var type = D.attr(item,'data-shareType') , url = shareUrl(type,self.opts);
								window.open(url);
								self.fire('share', {
									type : type,
									url : url
								});
							});
						});
					},
					update : function(options) {
						S.mix(this.opts , options);
					},
					addRule : function(type,rule) {
						shareObject[type] = rule;
					}
				}
				S.augment(Share, S.EventTarget);
				S.Share = Share;
			
			var cs = {title : '我家的宝宝正在参加亲子脸对对碰活动哦，快来支持一下吧！',
                      link : window.location.href,
                      pic : ''
                    };
            S.Share(D.query('#J_share .s'),cs);
		},
		/*
		* 加载弹出层
		* @name QZ.baby#popLoad
		* function
		*/	
		popLoad:function(){
			var self = this;
			var funDom = D.create('<div id="addOne" class="hidden">+1</div>');
			D.append(funDom,D.get('body'));
		},
		/*
		* 投票动画启动
		* @name QZ.baby#voitAddAnim
		* @param {object} con 目标元素
		* @param {object} addOne +1动画元素
		* @param {string} numBox 选择器
		* @param {object} position 动画元素和目标元素的偏移量{x:?,y:?} 
		* function
		*/	
		voitAddAnim:function(con,addOne,numBox,position){
			var self = this;
			var pos = {};
			pos = position?position : {x:72,y:215};
			//数值
			var num = numBox?D.get(numBox):D.get('.num',con);
			var numValue = parseInt(num.innerHTML);
			num.innerHTML = numValue+1;
			//+1动画
			var coo = D.offset(con);
			D.removeClass(addOne,'hidden');
			D.css(addOne,'opacity',1);
			D.css(addOne,{
				left:coo.left+pos.x,
				top:coo.top+pos.y
			})
			var tarTop = coo.top+pos.y-16;
			S.Anim(addOne,{
			top: tarTop+'px'
			}, 0.2, 'easeIn', function(){
								S.Anim(addOne,{
								opacity:0
								},0.2,'easeIn',function(){
								D.addClass(addOne,'hidden');
								}).run();
			}).run();
		},
		/*
		* 投票失败 
		* @name QZ.baby#voitFail
		* @param {object} data 请求返回的数据
		* function
		*/	
		voitFail:function(data){
			var self = this;
			//未登录
			if(data.status == '2'){
				self.login();
			}else
			//已经超过3次投票
			if(data.status == '3'){
				self.voteLimit(3);
			}else
			//6表示活动结束
			if(data.status == '6'){
				self.terminate(3);
			}else{
				self.netError(3);
			}
		},
		/*
		* 将遮盖层、弹出框等，置回初始状态
		* @name QZ.baby#clearWin
		* function
		*/	
		clearWin:function(){
			var self = this;
			var login = D.get('#login');
			if(!D.hasClass(login,'hidden')){D.addClass(login,'hidden');}
			//关遮罩层
			self.coverSwitch(false);
		},
	   /*
	    * 遮盖层开关,status没有值得时候，开关切换，还没完善
		* @name QZ.baby#coverSwitch
		* param {boolean} status true打开遮罩，false关闭
		* function
		*/	
		coverSwitch:function(status){
			var self = this;
			var cover = D.get('#cover');
			if(typeof(status)!='boolean'){
				alert('error');
			}else if(status){
				D.removeClass(cover,'hidden');
			}else{
				D.addClass(cover,'hidden');
			}
		},
	   /*
	    * 弹出登录框
		* @name QZ.baby#login
		* function
		*/	
		login:function(){
			var self = this;
			var cs = window.location.href.split('?')[1];
			//var cs = '';
			if(cs){
				var src = '?' + cs;
			}else{
				var src = '';
			}
			
			var url1 = 'http://www.taobao.com/go/act/info_baby/qinzilianindex.php',
				url2 = 'http://www.taobao.com/go/act/info_baby/qinziliandetail.php',
			    loginUrl = 'https://login.taobao.com/member/login.jhtml?style=minisimple&redirect_url=';
			    
			//详情页则跳转到本页，其他的都跳转到活动首页  
			
			if(D.hasClass(D.get('body'),'qinzi-detail')){
				var iframeSrc = loginUrl+encodeURIComponent(url2+src);
			}else{
				var iframeSrc = loginUrl+encodeURIComponent(url1+src);
			}
			
			var self = this;
			self.popWin('#login','<div id="login">'
									+'<a class="close" href="javascript:void(0);"></a>'
									+'<iframe style="height:225px;width:345px;border:none;" src="'+iframeSrc+'"></iframe>'
									+'</div>',[344,224]);
		},
	   /*
	    * 投票超过3次，弹提示框
		* @name QZ.baby#voteLimit
		* param {number} second 秒数，默认是3
		* function
		*/	
		voteLimit:function(second){
			var self = this;
			self.popWin('#J_vote3','<div id="J_vote3" class="tip tip2">'
									+'<a class="close" href="javascript:void(0);"></a>'
									+'<span class="tips">亲！您今天已经投过三次票，欢迎您明天再来。</span>'
									+'<span class="time"><em class="sec"></em>秒后自动关闭本提示框</span>'
									+'</div>',[444,140],3,'.sec');

			
		},
	   /*
	    * 发送错误，弹提示框,参数是秒数，默认3s
		* @name QZ.baby#netError
		* param {number} second 秒数，默认是3
		* function
		*/	
		netError:function(second){
			var self = this;
			self.popWin('#J_neterror','<div id="J_neterror" class="tip">'
									+'<a class="close" href="javascript:void(0);"></a>'
									+'<span class="tips">亲！网络错误啦，请稍后再试！</span>'
									+'<span class="time"><em class="sec"></em>秒后自动关闭本提示框</span>'
									+'</div>',[440,140],3,'.sec');
			
		},
	   /*
	    * 活动结束，弹提示框,参数是秒数，默认3s
		* @name QZ.baby#terminate
		* param {number} second 秒数，默认是3
		* function
		*/	
		terminate:function(second){
			var self = this;
			self.popWin('#J_neterror','<div id="J_neterror" class="tip">'
									+'<a class="close" href="javascript:void(0);"></a>'
									+'<span class="tips">亲！活动已经结束了哦！</span>'
									+'<span class="time"><em class="sec"></em>秒后自动关闭本提示框</span>'
									+'</div>',[440,140],3,'.sec');
			
		},
		/*
	    * 生成弹出框
		* @name QZ.baby#popWin
		* param {string} id 选择器带#号
		* param {string} content 弹出框的innerHTML
		* param {array}  size 弹出框的宽高
		* param {number} time 秒数
		* param {string} timeCon 存放时间的容器
		* function
		*/	
		popWin:function(id,content,size,time,timeCon){
			S.use('popwin',function(){
						var pop = (size)?new S.PopWin(size):new S.PopWin([360,250]);
						pop.setContent(content);
			            //登陆框
						E.on(D.get(id+' .close'),'click',function(e){
								pop.remove();
						});
                     	if(time != undefined&&typeof(time) == 'number'&&timeCon){
                     		var sec = D.get(timeCon,D.get(id));
                     		sec.innerHTML = time;
                     		var timekeeping = setInterval(function(){
							timer();
							},1000);
						}
						function timer(){
							time = parseInt(sec.innerHTML)-1;
							if(time == 0){
								pop.remove();
							}
							sec.innerHTML = time;
						}
						
                     	pop.show();
                     	
                     });
		}

	};
	
	
});












