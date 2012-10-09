# Box

- [Demo](http://taobao-wd.github.com/box/demo/demo-box.html)

# Info


-	����YUI3-overlay
-	����ͨ����չY.Box��ʵ���Զ��嵯��
-	����Ĭ�Ͽ����300px��Ĭ�ϸ߶���auto���߶ȿ�����������������仯����Ȳ���仯
-	��������Ϊauto��ʱ����ie6�±��ֺ�����A�����������һ�£���˲�����ʹ�ÿ��auto����
-	Ƥ����Ҫ�ڼ��ص�ʱ����Ϊbox����ģ���������
-	���Բ���������
-	safari,opera�µ���Ĭ���޷��ڸ�media�ؼ���chrome�µ���Ĭ�ϲ���ȫ�ڸ�media�ؼ�,����ͨ������antijamΪ true������media�ؼ�
-	��ie6��ie7��firefox2,firefox3,opera9,safari4,chrome�в���ͨ��


��Ҫ�����ļ���Ƥ��skin.css��box.js�����÷�������

	modules:{
		'box-skin-default':{//Ĭ��Ƥ��
			fullpath:'../skin/default.css',
			type:'css'
		},
		'box-skin-sea':{//����һ��Ƥ��
			fullpath:'../skin/sea.css',
			type:'css'
		},
		'box':{
			fullpath:'../box.js',
			requires:['box-skin-sea','node','overlay','dd-plugin']
		}
	}


�½�һ��Y.Box����

	var box = new Y.Box({
		head:'<span class="title">the title</span><a class="close">[x]',
		body:'body',
		foot:'foot'
	}).render();
	
����һ��Y.Box.alert,����ص����������ã����⡢����ק����ʾ�ص������صĻص��ȵ�

	var box = Y.Box.alert('������',function(box){
		alert('���ok');
		Y.log('���ok');
	},{
		title:'title',
		draggable:true,
		afterDrag:function(box){
			Y.log('��קover');
		},
		afterShow:function(box){
			Y.log('��ʾover');
		},
		afterHide:function(box){
			Y.log('����over');
		},
		onload:function(box){
			Y.log('��ʼ��over');
		}
		
	});
	
����һ��Y.Box.confirm������ص��������������ã����⣬���񡱵Ļص�����ק�Ļص�����ʾ�����صĻص��ȵ�

	var box = Y.Box.confirm('confirm',function(box){
		alert('���yes');
		Y.log('���yes');
	},{
		anim:false,
		title:'confirm title',
		no:function(box){
			alert('���no');
			Y.log('���no');	
		},
		cancleBtn:true,
		cancleTxt:'cancle',
		draggable:true,
		afterDrag:function(box){
			Y.log('��קconfirm over');
		},
		afterShow:function(box){
			Y.log('��ʾcomfirm over');
		},
		afterHide:function(box){
			Y.log('����comfirm over');
		},
		onload:function(box){
			Y.log('��ʼ��comfirm over');
		}
	});
	

Y.Boxʵ������ķ���
	
������
			
-	init:��ʼ��������Ϊoptions
-	bringToTop:��box��z-index��������box֮��
-	render:��Ⱦ��init��new��ʱ����ã�render����������ʱ����ʱ�̵��ã�����Ϊoptions�����Ա�ɸ���ԭ����
-	close:�رգ���������ɾ��
-	hide:���أ�����ɾ������
-	show:��ʾ����
-	buildParam:�����������init��ʱ�����
-	parseParam:�����������render��ʱ�����
-	addMask:�������
-	removeMask:ɾ������
-	hideMedias:����media������
-	showMedias:���media����������

**Y.Box.alert**
		
˵��:alert�����򣬻���Y.Box��һ�ֶ���

ʹ�ã�	

	Y.Box.alert(msg,callback,options)

������		
			
- msg:{string} ��Ϣ��
- callback:{function} ���ȷ���Ļص�������Ϊbox��Ĭ�ϵ��ȷ����رմ���
- options:{object} ������
			
���ã�		

-	title:{string} ����
-	closeable:{boolean} �Ƿ��йرհ�ť��Ĭ��Ϊtrue
-	closeText:{string} �����Զ��尴ť
-	btnText:{string} ȷ����ť���İ�
-	�������ֶ�ͬY.Box�� options��
		
**Y.Box.confirm**
	
˵��:comfirm�����򣬻���Y.Box��һ�ֶ���
ʹ�ã�	

	Y.Box.confirm(msg,callback,options)

������		

- msg:{string} ��Ϣ��
- callback:{function} ���ȷ���Ļص�������Ϊbox��Ĭ�ϵ��ȷ����رմ���
- options:{object} ������
			
���ã�		
			
-	title:{string} ����
-	yes:{function} ����ǵĻص�������Ϊbox��Ĭ�ϵ����رգ�����Ḳ��callback
-	no:{function} �����Ļص�������Ϊbox
-	yesText:{string} ��ť���ǡ����İ�
-	noText:{string} ��ť"��"���İ�
-	cancleBtn:{boolean} �Ƿ���ʾ"�ر�"��ť��Ĭ��Ϊtrue
-	cancleText:{string} ��ť��ȡ�������İ�
-	�������ֶ�ͬY.Box�� options��

**Y.Box**
	
˵�������ڹ�������ͨ��new Y.Box��renderһ��box������ʹ��Y.Box�����Լ���alert��comfirm��prompt�ȵ�

ʹ�ã�	

	new Y.Box(options);

���ã�		

-	head:{string} boxͷ��
-	body:{string} box���ⲿ��
-	foot:{string} boxβ��
-	fixed:{boolean} true,box�������Ŵ��ڹ�����������false��box�����Ŵ��ڹ�����������Ĭ��Ϊtrue��ie6��ʼ�ջ����ҳ�������������
-	afterDrag:{function} ��ק�����Ļص�������Ϊbox����
-	draggable:{boolean} �Ƿ����ק,Ĭ��Ϊtrue
-	resizeable:{boolean} �Ƿ��resize��Ĭ��Ϊfalse��δʵ�֣�
-	afterResize:{function} resize�����Ļص�������Ϊbox����δʵ�֣�
-	shownImmediately:{boolean} �Ƿ��ʼ�����������ʾ��Ĭ��Ϊtrue	  
-	afterHide:{function} ������Ϻ�Ļص�������Ϊbox
-	afterShow:{function} ��ʾ��ɺ�Ļص�������Ϊbox
-	onload:{function} ��ʼ����ɺ�Ļص�����render������ִ�У�����Ϊbox
-	modal:{boolean} �Ƿ����Ӱ��Ĭ��Ϊfalse����Ӱ�Ķ���Ч��δʵ��
-	beforeUnload:{function} ���ڹر�֮ǰ�Ļص�,����Ϊbox
-	afterUnload:{function} ���ڹر�֮��Ļص�,����Ϊbox		
-	antijam:{boolean} �Ƿ�����media�����Ĭ��Ϊfalse
-	maskOpacity:{float} �趨�ڸǲ��͸���ȣ���Χ��[0,1]��Ĭ��Ϊ0.6����modalΪtrueʱ��������

