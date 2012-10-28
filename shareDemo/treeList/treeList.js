/*write by baohe 2011-12-20*/
KISSY.use('node,tree,calendar,calendar/assets/base.css,switchable', function(S, Node, Tree, Calendar) {
	var _A = S.all, _O = S.one, E = S.Event, D = S.DOM;
	var Tabs = S.Tabs;
	var S_Date = S.Date;
	//var dir = jsonstr['rootDir']['dirList'];
	//第一次请求所有数据
	
	/**=============================
	 * 这里申明变量没有var，定义到全局去了，分号也漏了！
	 ==============================*/
	send = 'all';
	url = 'json.js';
	send = S.JSON.stringify(send);
	KISSY.io.post(url, {
		"data" : send
	}, function(recData) {
		window.original_Data = recData;
		bindData(recData)
	}, 'json');
	/**=============================
	* 下方的代码，缺少分号
	==============================*/
	//给按钮绑定事件
	//重置按钮
	_O('#reset').on('click', function(e) {
		if(confirm('数据将变成初始状态~确认重置吗？')) {
			location.reload();
		}
		return;
	})
	//保存按钮
	_O('#submit').on('click', function(e) {

	})
	/**========================================================================================
	* 一个方法太长，耦合严重
	==========================================================================================*/
	//bindData
	function bindData(recData) {
		var data = recData['rootDir']['dirList'];
		loopData(data);
		//数据导入成功之后使用tree组件

		var tree = new Tree({
			content : "树形结构",
			prefixCls : "goog-",
			expanded : true,
			srcNode : "#root"
		});
		tree.render();
		//此处生成的是文件节点，文件节点被双击之后，把数据导入页面里；
		//点击文件夹或者加减号，清空内容
		var folders1 = _A('#root .goog-tree-expand-icon');
		var folders2 = _A('#root .goog-tree-expanded-folder-icon');
		folders1.on('click', function(e) {
			clearAll();
		})
		folders2.on('click', function(e) {
			clearAll();
		})
		//清空重置函数
		function clearAll() {
			D.get('#tabBig').innerHTML = '';
			D.get('#descript').innerHTML = '';
			var ipButtonsBox = _A('#ipButtons');
			ipButtonsBox.css('display', 'none')
			try {
				var showingDot = D.get('#root .showing');
				var modifyButton = D.get('#modify');
				if(showingDot) {
					D.removeClass(showingDot, 'showing');
				}
				if(modifyButton && D.hasClass(modifyButton, 'modifing')) {
					D.removeClass(modifyButton, 'modifing');
				}
			} catch(e) {
			}
		}

		//点击修改按钮
		var modify = _O('#modify');
		modify.on('click', function(e) {
			//先判断是否有正在操作的节点，没有则返回
			try {
				var showingDot = D.get('#root .showing');
				if(showingDot) {
					//判断是否已经是编辑状态
					var tar = e.currentTarget;
					if(D.hasClass(tar, 'modifing')) {
						return;
					} else {
						D.addClass(tar, 'modifing');
					}
					var mesCon = D.get('#descript');
					var mesP = D.get('#descript .mesp');
					var mes = mesP.innerHTML;
					D.remove(mesP);
					var active = D.create('<textarea class="mesT">' + mes + '</textarea>');
					var buttonHtml = '<div id="J_buttonBoxMes"><button id="mesReset" type="button" class="btnl">重置</button><button type="button" id="mesSubmit" class="btnr">保存</button></div>';
					var saveButton = D.create(buttonHtml);

					D.appendTo(active, mesCon);
					D.appendTo(saveButton, mesCon);
					active.focus();
					//给重置按钮绑定事件
					var resetB = D.get('#mesReset', saveButton);
					E.on(resetB, 'click', function(e) {
						var des = D.get('#descript');
						var oldMes = D.attr(des, 'data-description');
						var newDom = D.create('<p class="mesp">' + oldMes + '</p>');
						des.innerHTML = '';
						D.appendTo(newDom, des);
						var modifyB = D.get('#modify');
						D.removeClass(modifyB, 'modifing');
					});
					//给提交按钮绑定事件
					var saveB = D.get('#mesSubmit', saveButton);
					E.on(saveB, 'click', function(e) {
						var des = D.get('#descript');
						var mesT = D.get('#descript .mesT');
						var oldMes = mesT.innerHTML;
						var newMes = mesT.value;
						des.innerHTML = '';
						D.appendTo(D.create('<p class="mesp">' + newMes + '</p>'), des);
						var modifyB = D.get('#modify');
						D.removeClass(modifyB, 'modifing');
						if(oldMes != newMes) {
							D.attr(des, 'data-description', newMes);
							var activeDom = D.get('#root .showing');
							D.attr(activeDom, 'data-description', newMes);
							alert('已经保存到本地，若要保存到数据库请按右下方提交按钮~');
						} else {
							return;
						}
					});
				}
			} catch(e) {
				return;
			}
		})
		//点击文件，进行内容展示
		var files = _A('#root .file');
		files.on('dblclick', function(e) {
			var tar = e.currentTarget;
			//展示之前清理旧数据
			clearAll();
			try {
				var showingDot = D.get('#root .showing');
				if(showingDot) {
					D.removeClass(showingDot, 'showing');
				};
			} catch(e) {
			}
			if(!D.hasClass(tar, 'showing')) {
				D.addClass(tar, 'showing');
			} else {
				return;
			}
			//ip编辑按钮处理
			//点击ip修改的3个按钮
			var ipButtonsBox = _A('#ipButtons');
			ipButtonsBox.css('display', 'block');
			_O('#ipChange').on('click', function(e) {

			})
			//展示页面
			pageShow(tar);
			function pageShow(dom) {
				var descript = D.get('#descript');
				var conBox = D.get('#conBox');
				//处理 描述-----
				descript.innerHTML = '';
				var des = D.attr(dom, 'data-description');
				var newDes = D.create('<p class="mesp">' + des + '</p>');
				D.attr(descript, 'data-description', des)
				D.appendTo(newDes, descript)
				//生成切换内容
				var ips = D.attr(dom, 'data-list-entry-scope').split(';');
				var type = D.attr(dom, 'data-type');
				var value = D.attr(dom, 'data-list-entry-value').split(';');
				var tabContent = D.get('#tabBig');
				D.attr(tabContent, {
					'data-list-entry-scope' : D.attr(dom, 'data-list-entry-scope'),
					'data-list-entry-value' : D.attr(dom, 'data-list-entry-value'),
					'data-type' : D.attr(dom, 'data-type')
				})
				var switchBox = D.create('<div class="ks-switchable2-content con"></div>')
				var tabBox = D.create('<div id="J_tabBig"><div id="J_buttonBox"><button type="button" class="btn1">取消</button><button type="button" class="btn2">保存</button></div><ul id="ipBox" class="leftUl ks-switchable2-nav" role="tablist" data-type="' + type + '"></ul></div>');
				var ulDom = D.get('ul', tabBox);

				for(var i = 0; i < ips.length; i++) {
					var ord = i + 1;
					var conHtml = '<div class="tabpage" style="display:none">' + '<ul class="ks-switchable-nav clearfix valueType">' + '<li class="linum li1 tab"><input class="valueTypeItem" type="radio" id="mold1' + ord + '" name="mold' + ord + '" value="string"/><label for="mold1' + ord + '">string</label></li>' + '<li class="linum li2 tab"><input class="valueTypeItem" type="radio" id="mold2' + ord + '" name="mold' + ord + '" value="boolean"/><label for="mold2' + ord + '">boolean</label></li>' + '<li class="linum li3 tab"><input class="valueTypeItem" type="radio" id="mold3' + ord + '" name="mold' + ord + '" value="date"/><label for="mold3' + ord + '">date</label></li>' + '<li class="linum li4 tab"><input class="valueTypeItem" type="radio" id="mold4' + ord + '" name="mold' + ord + '" value="number"/><label for="mold4' + ord + '">number</label></li>' + '</ul>' + '<div class="ks-switchable-content con2">' + '<div class="tabCon string" style="display:none;">' + '<textarea class="stringBox"></textarea>' + '</div>' + '<div class="tabCon tabCon2 boolean" style="display:none;">' + '<input type="radio" name="boolean' + ord + '" id="boolean1' + ord + '" value="true"/><label for="boolean1' + ord + '">是</label>' + '<input type="radio" name="boolean' + ord + '" id="boolean2' + ord + '" value="false" checked="checked"/><label for="boolean2' + ord + '">否</label>' + '</div>' + '<div class="tabCon date" style="display:none;">' + '<input type="text" style="margin-left:50px;" class="J_Popup"/>' + '</div>' + '<div class="tabCon number" style="display:none;">' + '<input type="text" style="margin-left:50px;"/>' + '</div>' + '</div>' + '</div>';
					var newCon = D.create(conHtml);

					if(i == 0) {
						var newli = '<li class="ks-active" data-list-entry-value="' + value[i] + '"><span><input type="radio" name="ipList" id="ip' + (i + 1) + '" checked="checked"/><label for="ip' + (i + 1) + '">' + ips[i] + '</label></span></li>';
						//第一个的内容块特殊样式
						D.css(newCon, 'display', 'block');
						var t1 = D.get('.tabpage', newCon);
						D.addClass(t1, 'ks-active');
					} else {
						var newli = '<li data-list-entry-value="' + value[i] + '"><span><input type="radio" name="ipList" id="ip' + (i + 1) + '"/><label for="ip' + (i + 1) + '">' + ips[i] + '</label></span></li>';
					}
					newli = D.create(newli);
					//插入ul li
					D.appendTo(newli, ulDom);
					//插入切换内容
					//设置值的类型
					var radios = D.query('.valueTypeItem', newCon);
					var radios_shadow = D.query('.tabCon', newCon);
					for(var j = 0; j < radios.length; j++) {

						if(radios[j].value == type) {
							radios[j].checked = true;
							//设置相应类型下的值
							var valueShow = radios_shadow[j];
							D.attr(valueShow, 'data-oldValue', value[i]);

							if(D.hasClass(valueShow, 'string')) {
								D.get('.stringBox', valueShow).value = value[i];
							} else if(D.hasClass(valueShow, 'number')) {
								D.get('input', valueShow).value = value[i];
							} else if(D.hasClass(valueShow, 'boolean')) {
								var radiosL = D.query('input', valueShow);
								if(radiosL[0].value == value[i]) {
									radiosL[0].checked = true;
								} else {
									radiosL[1].checked = true;
								}
							} else if(D.hasClass(valueShow, 'date')) {
								D.get('input', valueShow).value = value[i];
							} else {
								alert('error');
							}
						}
					}
					//操作完毕，插入节点
					D.appendTo(newCon, switchBox);
				}
				/**================================================================================
				* 要尽量减少dom的操作，多次操作尽量合并
				=================================================================================*/
				//各种插入
				tabContent.innerHTML = '';
				D.appendTo(tabBox, tabContent);
				D.appendTo(switchBox, tabContent);

				//因为值的类型是统一的，需要绑定好事件，是每个ul里的单选钮同步

				var ulList = D.query('.valueType', switchBox);

				var radios = [];
				for(var i = 0; i < ulList.length; i++) {
					radios[i] = D.query('.valueTypeItem', ulList[i]);
				}

				for(var j = 0; j < ulList.length; j++) {
					E.on(ulList[j], 'click', function(e) {
						var cTar = e.currentTarget;
						var oldType = D.attr(D.get('#tabBig'), 'data-type');

						var ulList = D.query('.valueType', switchBox);
						var radios = [];
						var radiosActive;
						var mark;
						for(var i = 0; i < ulList.length; i++) {
							if(cTar == ulList[i]) {
								radiosActive = D.query('.valueTypeItem', ulList[i]);
								liActive = D.query('.ks-active', ulList[i]);
								D.get('.valueTypeItem', liActive).checked = true;
								//遍历radios确定哪个radio被选中
								for(var j = 0; j < radiosActive.length; j++) {
									if(radiosActive[j].checked == true) {//找到新被选中的单选框
										//得到选中的新radios单选框，给其他的radios同步
										var oldType = D.attr(D.get('#tabBig'), 'data-type');
										//把其他对应位置的值类型同步
										mark = j;
									}
								}
							}

						}
						for(var n = 0; n < ulList.length; n++) {
							D.query('.valueTypeItem',ulList[n])[mark].click();
						}

					})
				}

				//插入节点完毕，给里面加入交互
				//小Tab
				var tabpage = D.query('#tabBig .tabpage');
				for(var n = 0; n < tabpage.length; n++) {
					var num = 0;
					switch(type) {
						case 'string':
							num = 0;
							break;
						case 'boolean':
							num = 1;
							break;
						case 'date':
							num = 2;
							break;
						case 'number':
							num = 3;
							break;
						default:
							num = 0;
							break;
					}
					var x = new Tabs(tabpage[n], {
						triggerType : "click",
						switchTo : num
					});
					//给里面的data给一个日历组件

					new Calendar(D.get('.J_Popup', tabpage[n]), {
						popup : true,
						showTime : true,
						triggerType : ['click']
					}).on('timeSelect', function(e) {
						var tar = e.currentTarget;
						Node.one('#' + tar['id']).val(S_Date.format(e.date, 'yyyy-mm-dd HH:MM:ss'));
						tar.hide();
					});
				}

				//大Tab
				var bigTab = new Tabs('#tabBig', {
					triggerType : "click",
					navCls : "ks-switchable2-nav",
					contentCls : "ks-switchable2-content"
				});
				//tabBox中保存取消按钮的事件
				var saveTypeButton = D.get('.btn2', tabBox);
				console.log(saveTypeButton);
				var cancelTypeButton = D.get('.btn1', tabBox);
				/**================================================================================
				* 事件监听，最好是拆开
				=================================================================================*/
				E.on(cancelTypeButton, 'click', function(e) {

					var oldType = D.attr(D.get('#tabBig'), 'data-type');
					//把值类型重置
					var radios = D.query('.valueTypeItem', D.get('#tabBig .valueType'));
					for(var i = 0; i < radios.length; i++) {
						if(radios[i].value == oldType) {
							radios[i].click();
							//重置数据
							var select = '.' + oldType;
							var value_shadow = D.query(select, D.get('#tabBig'));

							var dataCon = D.query('li', D.get('#ipBox'));
							/**================================================================================
							* 应该有效率更高的，严格比较符===
							=================================================================================*/
							if(oldType == 'boolean') {
								for(var j = 0; j < value_shadow.length; j++) {
									var oldValue = D.attr(value_shadow[j], 'data-oldvalue');
									bRadios = D.query('input', value_shadow[j]);
									for(var k = 0; k < bRadios.length; k++) {
										if(bRadios[k].value = oldType) {
											bRadios[k].checked = true;
										} else {
											alert('error!');
										}
									}
								}
							} else {
								for(var j = 0; j < value_shadow.length; j++) {
									var oldValue = D.attr(value_shadow[j], 'data-oldvalue');
									var dataInsert = D.get('input', value_shadow[j]);
									//debugger;
									dataInsert.value = oldValue;
								}
							}
						}
					}
				});

				E.on(saveTypeButton, 'click', function(e) {
					if(!confirm('保存到本地？')) {
						return;
					}

					//先看保存的值类型
					var tab = D.get('#tabBig .valueType');
					var radios = D.query('.valueTypeItem', tab);
					//debugger;
					var len = radios.length;
					for(var i = 0; i < len; i++) {
						if(radios[i].checked == true) {
							var newType = radios[i].value;
						}
					}
					console.log(newType);
				});
			}

		})
	}
	/**================================================================================
	* 缺乏必要的注释描述功能
	=================================================================================*/
	function loopData(data, con) {
		for(var i = 0; i < data.length; i++) {
			var name = data[i]['name'];
			var label = D.create('<span class="goog-tree-item-label">' + name + '</span>');
			var fatherDom;
			//如果有子文件
			if(data[i]['entryList'].length > 0) {
				var labels = '';
				var len = data[i]['entryList'].length;

				for(var j = 0; j < len; j++) {

					var name_entry = data[i]['entryList'][j]['name'];
					var type_entry = data[i]['entryList'][j]['type'];
					var list_entry = data[i]['entryList'][j]['elementList'];
					var desc_entry = data[i]['entryList'][j]['description'];
					list_entry_scope = '';
					list_entry_value = '';
					for(var n = 0; n < list_entry.length; n++) {
						if(n == list_entry.length - 1) {
							var footer = '';
						} else {
							var footer = ';';
						}
						list_entry_scope += list_entry[n]['scope'] + footer;
						list_entry_value += list_entry[n]['value'] + footer;
					}
					var oneMes = '<div class="goog-tree-item"><span class="goog-tree-item-label file" data-type="' + type_entry + '" data-list-entry-scope="' + list_entry_scope + '" data-list-entry-value="' + list_entry_value + '" data-description="' + desc_entry + '">' + name_entry + '</span></div>'
					labels = labels + oneMes;
				}
				fatherDom = D.create('<div class="goog-tree-children"></div>');
				/**================================================================================
				* dom操作没有合并
				=================================================================================*/
				if(!con) {//第一级容器为＃root
					con = D.get('#root');
					fatherDom.innerHTML = labels;
					D.appendTo(label, con);
					D.appendTo(fatherDom, con);
				} else {
					var content = D.create('<div class="goog-tree-item goog-tree-item-folder"></div>');
					D.appendTo(label, content);
					D.appendTo(D.create(labels), fatherDom)
					D.appendTo(fatherDom, content);
					D.appendTo(content, con);
				}
				//debugger;

			};
			//如果有子文件夹
			if(data[i]['dirList'].length > 0) {
				loopData(data[i]['dirList'], fatherDom);
			};
		}
	}

});
