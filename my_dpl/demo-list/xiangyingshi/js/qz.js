/*
 * @fileoverview������ҳ�е���ؽ���ʵ��
 * @author��baohe.oyt
 * @version��1.0
 * @time��2012-2-16
 */
KISSY.app('QZ');
QZ.add('init',function(QZ){
	var S=KISSY,D=S.DOM,E=S.Event,UA=S.UA;
			/*
			 * ��ų��õķ���
			 * @name QZ.common
			 */
	QZ.common={
			/*
			 * ajax����
			 * @name QZ.common#sendRequest
			 * @param{string} _surl �����ַ
			 * @param{function} _callback �ص�����
			 * @param{string} _data ���� 
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
	 * ���ӻ
	 */
	QZ.baby={
		/*
		 * ��ҳ�ĳ�ʼ��
		 * @name QZ.baby#init
		 * @param{object} config ����
		 * function
		 */
		init:function(config){
			var self = this;
			self.commonInit();
			//���¼�
			self.bindEvent();
			//ͼƬ�ӳټ���
			/*
			S.use('datalazyload',function(S, DataLazyload){
			  	S.ready(function(S) {
		        	S.DataLazyload( { mod: 'manual' } );
		    	});
		   	});
		    */
		},
		/*
		* ����ҳ�ĳ�ʼ��
		* @name QZ.baby#detail_init
		* function
		*/	
		detail_init:function(){
			var self = this;
			self.commonInit();
			//������ҳ���¼�
			self.bindEventDetail();
			//����΢��������
			self.share();

		},
		/*
		* ����ҳ�ĳ�ʼ��
		* @name QZ.baby#search_init
		* function
		*/	
		search_init:function(){
			var self = this;
			//����Ϊ����ʾ ��ʱȥ��
			return this;
		},
		/*
		* ������ʼ������
		* @name QZ.baby#commonInit
		* function
		*/	
		commonInit:function(){
			document.domain = "taobao.net";
			var self = this;
			//�����ڸǲ㡢�Ի��򡢵�½�򡢵Ƚڵ㣻
			self.popLoad();
			//���������
			S.add('popwin',{
                     fullpath:'http://a.tbcdn.cn/apps/pegasusmyhome/widgets/PopWin/PopWin.js',
                     cssfullpath:'http://a.tbcdn.cn/apps/pegasusmyhome/widgets/PopWin/PopWin.css'
                  });
            //����ĵ�¼��ע����ת
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
		* ��ҳ���¼�
		* @name QZ.baby#bindEvent
		* function
		*/	
		bindEvent:function(){
			var self = this;
			//�¼��������ͶƱ��ťִ��
			var mainCon = D.get('#J_mainCon');
			E.on(mainCon,'click',function(e){
				var tar = e.target;
				if(D.hasClass(tar,'vote')){
					var unit = D.parent(tar, '.one');
					//����ͶƱ����
					var sendData =  'babyid='+D.attr(D.get('.babyid',unit),'value')
									+'&_tb_token_='
									+D.attr(D.get('.tb_token',unit),'value');
					var requestUrl = D.attr(D.get('#requestUrl'),'value');
					QZ.common.sendRequest(requestUrl,function(data){
						//��������ȷ״̬��ִ��+1�Ķ���
						if(data.status == '1'||data.status == 1){
							self.voitAddAnim(unit,D.get('#addOne'));	
						}else{
							self.voitFail(data);	
						}
					},sendData);
				}
			});
			//ie6�£�hover
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
		* ����ҳ���¼�
		* @name QZ.baby#bindEventDetail
		* function
		*/	
		bindEventDetail:function(requestUrl){
			var self = this;
			var voteButton = D.get('#J_vote');
			E.on(voteButton,'click',function(e){
				
					//����ͶƱ����
					var sendData = 'babyid='+D.attr(D.get('#J_babyid'),'value')
									+'&_tb_token_='
									+D.attr(D.get('.tb_token'),'value');
					var requestUrl = D.attr(D.get('#requestUrl'),'value');
					QZ.common.sendRequest(requestUrl,function(data){
						//��������ȷ״̬��ִ��+1�Ķ���
						if(data.status == '1'||data.status == 1){
							self.voitAddAnim(e.currentTarget,D.get('#addOne'),'#J_vote',{x:165,y:0});
							//�޸�����
							D.get('#J_ord').innerHTML = data.rank;
						}else{
							self.voitFail(data);	
						}
					},sendData);
			});
		},
		/*
		* ����(���ˡ����ˡ�QQ�ռ䡢�Խ���)
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
			
			var cs = {title : '�Ҽҵı������ڲμ��������Զ����Ŷ������֧��һ�°ɣ�',
                      link : window.location.href,
                      pic : ''
                    };
            S.Share(D.query('#J_share .s'),cs);
		},
		/*
		* ���ص�����
		* @name QZ.baby#popLoad
		* function
		*/	
		popLoad:function(){
			var self = this;
			var funDom = D.create('<div id="addOne" class="hidden">+1</div>');
			D.append(funDom,D.get('body'));
		},
		/*
		* ͶƱ��������
		* @name QZ.baby#voitAddAnim
		* @param {object} con Ŀ��Ԫ��
		* @param {object} addOne +1����Ԫ��
		* @param {string} numBox ѡ����
		* @param {object} position ����Ԫ�غ�Ŀ��Ԫ�ص�ƫ����{x:?,y:?} 
		* function
		*/	
		voitAddAnim:function(con,addOne,numBox,position){
			var self = this;
			var pos = {};
			pos = position?position : {x:72,y:215};
			//��ֵ
			var num = numBox?D.get(numBox):D.get('.num',con);
			var numValue = parseInt(num.innerHTML);
			num.innerHTML = numValue+1;
			//+1����
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
		* ͶƱʧ�� 
		* @name QZ.baby#voitFail
		* @param {object} data ���󷵻ص�����
		* function
		*/	
		voitFail:function(data){
			var self = this;
			//δ��¼
			if(data.status == '2'){
				self.login();
			}else
			//�Ѿ�����3��ͶƱ
			if(data.status == '3'){
				self.voteLimit(3);
			}else
			//6��ʾ�����
			if(data.status == '6'){
				self.terminate(3);
			}else{
				self.netError(3);
			}
		},
		/*
		* ���ڸǲ㡢������ȣ��ûس�ʼ״̬
		* @name QZ.baby#clearWin
		* function
		*/	
		clearWin:function(){
			var self = this;
			var login = D.get('#login');
			if(!D.hasClass(login,'hidden')){D.addClass(login,'hidden');}
			//�����ֲ�
			self.coverSwitch(false);
		},
	   /*
	    * �ڸǲ㿪��,statusû��ֵ��ʱ�򣬿����л�����û����
		* @name QZ.baby#coverSwitch
		* param {boolean} status true�����֣�false�ر�
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
	    * ������¼��
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
			    
			//����ҳ����ת����ҳ�������Ķ���ת�����ҳ  
			
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
	    * ͶƱ����3�Σ�����ʾ��
		* @name QZ.baby#voteLimit
		* param {number} second ������Ĭ����3
		* function
		*/	
		voteLimit:function(second){
			var self = this;
			self.popWin('#J_vote3','<div id="J_vote3" class="tip tip2">'
									+'<a class="close" href="javascript:void(0);"></a>'
									+'<span class="tips">�ף��������Ѿ�Ͷ������Ʊ����ӭ������������</span>'
									+'<span class="time"><em class="sec"></em>����Զ��رձ���ʾ��</span>'
									+'</div>',[444,140],3,'.sec');

			
		},
	   /*
	    * ���ʹ��󣬵���ʾ��,������������Ĭ��3s
		* @name QZ.baby#netError
		* param {number} second ������Ĭ����3
		* function
		*/	
		netError:function(second){
			var self = this;
			self.popWin('#J_neterror','<div id="J_neterror" class="tip">'
									+'<a class="close" href="javascript:void(0);"></a>'
									+'<span class="tips">�ף���������������Ժ����ԣ�</span>'
									+'<span class="time"><em class="sec"></em>����Զ��رձ���ʾ��</span>'
									+'</div>',[440,140],3,'.sec');
			
		},
	   /*
	    * �����������ʾ��,������������Ĭ��3s
		* @name QZ.baby#terminate
		* param {number} second ������Ĭ����3
		* function
		*/	
		terminate:function(second){
			var self = this;
			self.popWin('#J_neterror','<div id="J_neterror" class="tip">'
									+'<a class="close" href="javascript:void(0);"></a>'
									+'<span class="tips">�ף���Ѿ�������Ŷ��</span>'
									+'<span class="time"><em class="sec"></em>����Զ��رձ���ʾ��</span>'
									+'</div>',[440,140],3,'.sec');
			
		},
		/*
	    * ���ɵ�����
		* @name QZ.baby#popWin
		* param {string} id ѡ������#��
		* param {string} content �������innerHTML
		* param {array}  size ������Ŀ��
		* param {number} time ����
		* param {string} timeCon ���ʱ�������
		* function
		*/	
		popWin:function(id,content,size,time,timeCon){
			S.use('popwin',function(){
						var pop = (size)?new S.PopWin(size):new S.PopWin([360,250]);
						pop.setContent(content);
			            //��½��
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












