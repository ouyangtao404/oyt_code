# Waterfall

- [Demo](#)

# Info


-	瀑布流组件
-	原理：创建并列的几个容器，根据容器的高度，来优先渲染dom节点插入到短的容器中


需要注意的：需要写好基本的相应的样式代码


新建一个Waterfall对象

		new Waterfall('#contents', {
			//brooks参数是制定几个容器，没有的话，需要组件会在容器里自动创建
            brooks: D.query('.J_plaza_brook'),
            //给每纵列的基本高度，是顶部不齐的，能尽量底部对齐,不填写时瀑布流组件会自动计算
            //basicHeight: [0, 0, 0, 410],
            //图片的class，用于在插入元素之前操作元素
            imageClass: 'oneimg',
            /**渲染函数
			* requestSuccess 参数为瀑布流代码块
			* end 结束瀑布流
			* context 瀑布流组件的上下文
			*/
            load: function(requestSuccess, end, context) {
             itemsnull = 0;
                var self = this,
                    leftItems = data.items,
                    len = 10,//一次触发插入的插入个数
                    items = [],
                    currentItem,
                    isLastTime2 = false;//做一个标记，判断所有信息是否渲染完成
                
                for(var i=0; i<len; i++) {
                 	if(leftItems.length > 0) {
						var item = S.Template(waterfall_tpl).render(leftItems[0]),
						newItemDom = D.create(item);
						items.push(newItemDom);
						leftItems.shift();
                    }
                    if(leftItems.length == 0){//没有更多的信息渲染了
                        end.apply(context);//终止瀑布流渲染
                        isLastTime2 = true;
                        break;
                    }
                }
                //最后一次渲染，给最后一个参数传一个true，才能触发瀑布流渲染完成的回调
                requestSuccess.call(context, items, isLastTime2);
            },
            //单个item插入之前
            //此时图片已经算好高度了
            insertBefore: function(imgData) {
            var _self = this;//该item
            
           	if(!imgData.isHasImg)return;//没有图片的item
            
            if(isOverHeight(imgData)) {
            var img = D.get('.big-img', _self);
                D.css(img, 'height', 300);
                D.css(D.get('.mask', D.parent(img, '.waterfall-item')), 'display', 'block');
            }
            },
            /**单个item插入之后,参数值如下
				*{
				isHasImg: false/true,有无图片，以及尺寸，无图片尺寸为0
				height: 100,
				width : 200
				};
			*/
            insertAfter: function(imgData) {
	            var _self = this,//该item
	            para,
	            minHeight = 90,
		        height;
		        if(imgData.isHasImg) return;//item存在大图片时不进行限高操作
		        para = D.get('.para', _self),
		        height = D.height(para);
		        if(height < minHeight){
		        D.css(para, 'height', minHeight+'px');
		        }
            },
            //单个item显示完整（渐隐完成）
            itemComplete: function() {
             	var _self = this;//该item
            },
            //所有信息渲染完成，执行依赖isLastTime
            renderComplete: function() {
             	alert('render complete!');
            }
        });


Waterfall实例对象的方法
	
方法：
			
-	success:将数据和结构组合好的新建dom节点集合作为第一个参数传入，内容便可在瀑布流中展示当是最后一次渲染的时候，传入一个布尔值true，作为标记，关系到renderComplete的触发
-	end:终止瀑布流渲染


** Waterfall **
	
说明：窗口构造器，通过new Y.Box来render一个box，可以使用Y.Box定制自己的alert、comfirm、prompt等等

使用：	

	new Waterfall(container, options);

配置：		

-	brooks:{object} 指定几个容器，没有的话，需要组件会在容器里自动创建
-	basicHeight: {array} 各个容器的基本高度，建议不用填，会自动计算基本高度，使瀑布流底部优先插入视觉上考上的一列
-	brookName:{string} 瀑布流每列的class，默认为'J_plaza_brook'
-	colCount:{number} 瀑布流列数,若已经有制定的列容器则不用填
-	colWidth:{number} 每列宽度,若已经有制定的列容器则不用填
-	imageClass:{string} 瀑布流item的图片的class，用于有大图的item操作img元素
-	load:{function} 渲染函数，有3个参数分别为：渲染代码库的function，结束瀑布流渲染的function，瀑布流组件本身
-	insertBefore：{function} 每个item插入之前触发，this为该item，唯一的参数是该item的大图信息，如下
-		{
-			isHasImg: false/true,有无图片，以及尺寸，无图片尺寸为0
-			height: 100,
-			width : 200
-		};
-	insertAfter:{function} 每个item插入之后触发，this和参数同insetAfter
-	itemComplete:{function} 每个item显示完整（渐隐显示）后触发，this为该item
-	renderComplete:{function} 所有信息渲染完成（以实例的属性isLastTime为标记）后触发

