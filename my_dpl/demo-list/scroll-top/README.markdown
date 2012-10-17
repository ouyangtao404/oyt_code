# 回到顶部功能

- [Demo](#)

# Info

参考结构如下
	<a id="J_scrollTop" href="javascript:void(0);" style="">scroll to top</a>

参考样式如下
	html{
		_background: url(about:black) no-repeat fixed;
	}
	#J_scrollTop{
		position:fixed;
		right:0;
		bottom:200px;
		background-color:black;
		_position:absolute;
		_top:expression(documentElement.scrollTop + 400 + "px");
		width:90px;
		height:40px;
		line-height:40px;
		text-align:center;
		color:#fff;
		border-radius:3px;
	}

参考js代码如下（需要先引入kissy文件）：


	var S = KISSY, D = S.DOM, E = S.Event;
	S.use('anim', function(S){
		S.one('#J_scrollTop').on('click', function(e){
			new S.Anim(D.get('html'), {'scrollTop': 0}, .4, 'easeOut').run();
		});
	});

