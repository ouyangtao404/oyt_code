# Waterfall

- [Demo](#)

# Info


-	�ٲ������
-	ԭ���������еļ������������������ĸ߶ȣ���������Ⱦdom�ڵ���뵽�̵�������


��Ҫע��ģ���Ҫд�û�������Ӧ����ʽ����


�½�һ��Waterfall����

		new Waterfall('#contents', {
			//brooks�������ƶ�����������û�еĻ�����Ҫ��������������Զ�����
            brooks: D.query('.J_plaza_brook'),
            //��ÿ���еĻ����߶ȣ��Ƕ�������ģ��ܾ����ײ�����,����дʱ�ٲ���������Զ�����
            //basicHeight: [0, 0, 0, 410],
            //ͼƬ��class�������ڲ���Ԫ��֮ǰ����Ԫ��
            imageClass: 'oneimg',
            /**��Ⱦ����
			* requestSuccess ����Ϊ�ٲ��������
			* end �����ٲ���
			* context �ٲ��������������
			*/
            load: function(requestSuccess, end, context) {
             itemsnull = 0;
                var self = this,
                    leftItems = data.items,
                    len = 10,//һ�δ�������Ĳ������
                    items = [],
                    currentItem,
                    isLastTime2 = false;//��һ����ǣ��ж�������Ϣ�Ƿ���Ⱦ���
                
                for(var i=0; i<len; i++) {
                 	if(leftItems.length > 0) {
						var item = S.Template(waterfall_tpl).render(leftItems[0]),
						newItemDom = D.create(item);
						items.push(newItemDom);
						leftItems.shift();
                    }
                    if(leftItems.length == 0){//û�и������Ϣ��Ⱦ��
                        end.apply(context);//��ֹ�ٲ�����Ⱦ
                        isLastTime2 = true;
                        break;
                    }
                }
                //���һ����Ⱦ�������һ��������һ��true�����ܴ����ٲ�����Ⱦ��ɵĻص�
                requestSuccess.call(context, items, isLastTime2);
            },
            //����item����֮ǰ
            //��ʱͼƬ�Ѿ���ø߶���
            insertBefore: function(imgData) {
            var _self = this;//��item
            
           	if(!imgData.isHasImg)return;//û��ͼƬ��item
            
            if(isOverHeight(imgData)) {
            var img = D.get('.big-img', _self);
                D.css(img, 'height', 300);
                D.css(D.get('.mask', D.parent(img, '.waterfall-item')), 'display', 'block');
            }
            },
            /**����item����֮��,����ֵ����
				*{
				isHasImg: false/true,����ͼƬ���Լ��ߴ磬��ͼƬ�ߴ�Ϊ0
				height: 100,
				width : 200
				};
			*/
            insertAfter: function(imgData) {
	            var _self = this,//��item
	            para,
	            minHeight = 90,
		        height;
		        if(imgData.isHasImg) return;//item���ڴ�ͼƬʱ�������޸߲���
		        para = D.get('.para', _self),
		        height = D.height(para);
		        if(height < minHeight){
		        D.css(para, 'height', minHeight+'px');
		        }
            },
            //����item��ʾ������������ɣ�
            itemComplete: function() {
             	var _self = this;//��item
            },
            //������Ϣ��Ⱦ��ɣ�ִ������isLastTime
            renderComplete: function() {
             	alert('render complete!');
            }
        });


Waterfallʵ������ķ���
	
������
			
-	success:�����ݺͽṹ��Ϻõ��½�dom�ڵ㼯����Ϊ��һ���������룬���ݱ�����ٲ�����չʾ�������һ����Ⱦ��ʱ�򣬴���һ������ֵtrue����Ϊ��ǣ���ϵ��renderComplete�Ĵ���
-	end:��ֹ�ٲ�����Ⱦ


** Waterfall **
	
˵�������ڹ�������ͨ��new Y.Box��renderһ��box������ʹ��Y.Box�����Լ���alert��comfirm��prompt�ȵ�

ʹ�ã�	

	new Waterfall(container, options);

���ã�		

-	brooks:{object} ָ������������û�еĻ�����Ҫ��������������Զ�����
-	basicHeight: {array} ���������Ļ����߶ȣ����鲻������Զ���������߶ȣ�ʹ�ٲ����ײ����Ȳ����Ӿ��Ͽ��ϵ�һ��
-	brookName:{string} �ٲ���ÿ�е�class��Ĭ��Ϊ'J_plaza_brook'
-	colCount:{number} �ٲ�������,���Ѿ����ƶ���������������
-	colWidth:{number} ÿ�п��,���Ѿ����ƶ���������������
-	imageClass:{string} �ٲ���item��ͼƬ��class�������д�ͼ��item����imgԪ��
-	load:{function} ��Ⱦ��������3�������ֱ�Ϊ����Ⱦ������function�������ٲ�����Ⱦ��function���ٲ����������
-	insertBefore��{function} ÿ��item����֮ǰ������thisΪ��item��Ψһ�Ĳ����Ǹ�item�Ĵ�ͼ��Ϣ������
-		{
-			isHasImg: false/true,����ͼƬ���Լ��ߴ磬��ͼƬ�ߴ�Ϊ0
-			height: 100,
-			width : 200
-		};
-	insertAfter:{function} ÿ��item����֮�󴥷���this�Ͳ���ͬinsetAfter
-	itemComplete:{function} ÿ��item��ʾ������������ʾ���󴥷���thisΪ��item
-	renderComplete:{function} ������Ϣ��Ⱦ��ɣ���ʵ��������isLastTimeΪ��ǣ��󴥷�

