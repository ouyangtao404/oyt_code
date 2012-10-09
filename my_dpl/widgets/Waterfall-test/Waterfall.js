/**
* Waterfall.js | cubee ������ؼ�
* @author baohe.oyt@taobao.com
* @class Y.Box
* @param { object } ������
* @return { object } ����һ��Waterfallʵ��
*
* S.Waterfall��
* ˵�����ٲ��������ͨ��new S.Waterfall ���� new Waterfall������һ���ٲ���,�������ݵ����ƣ�
    * ֻ��Ҫ��ʵ����success���������´�����dom�ڵ㼯�ϱ�ɣ�success����Ҳ������load�����ĵ�һ����������ȡ
    * ִ��ʵ����end����������ֹͣ�ٲ����ļ�����Ⱦ������������Թ��������ײ�����ؼ���������
* ʹ�ã� new Waterfall(container, options);
* ���ã�
* brooks:{object} ָ������������û�еĻ�����Ҫ��������������Զ�����
* basicHeight: {array} ���������Ļ����߶ȣ����鲻������Զ���������߶ȣ�ʹ�ٲ����ײ����Ȳ����Ӿ��Ͽ��ϵ�һ��
* brookName:{string} �ٲ���ÿ�е�class��Ĭ��Ϊ'J_plaza_brook'
* colCount:{number} �ٲ�������,���Ѿ����ƶ���������������
* colWidth:{number} ÿ�п��,���Ѿ����ƶ���������������
* imageClass:{string} �ٲ���item��ͼƬ��class�������д�ͼ��item����imgԪ��
* load:{function} ��Ⱦ��������3�������ֱ�Ϊ����Ⱦ������function�������ٲ�����Ⱦ��function���ٲ����������
* insertBefore��{function} ÿ��item����֮ǰ������thisΪ��item��Ψһ�Ĳ����Ǹ�item�Ĵ�ͼ��Ϣ������ 
    * imgData = {
    * isHasImg: false/true,����ͼƬ���Լ��ߴ磬��ͼƬ�ߴ�Ϊ0
    * height: 100,
    * width : 200
    * };
* insertAfter:{function} ÿ��item����֮�󴥷���this�Ͳ���ͬinsetAfter
* itemComplete:{function} ÿ��item��ʾ������������ʾ���󴥷���thisΪ��item
* renderComplete:{function} ������Ϣ��Ⱦ��ɣ���ʵ��������isLastTimeΪ��ǣ��󴥷�
* 
* S.Waterfall��ʵ���ķ�����
* success:�����ݺͽṹ��Ϻõ��½�dom�ڵ㼯����Ϊ�������룬���ݱ�����ٲ�����չʾ
* end:��ֹ�ٲ�����Ⱦ
*/
KISSY.add('widgets/Waterfall/Waterfall', function(S) {
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
            S.log('��������ȷ��id.');
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
            //��ʼ��һ�����߸�self.imgReady;
            self.imgReady = self._checkImgSizeInit();
        },
        //���ò���
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
            //����Ѿ�Ԥ���˽ṹ������Ҫ��������
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
         * ��ʼ��һ�����������ڼ���ͼƬ�ߴ�
         * ����ѷ��صĶ���ֵ��self.imgReady 
         */
        _checkImgSizeInit: function() {
            var self = this,
                list = [], 
                intervalId = null,

            // ����ִ�ж���
            tick = function () {
                var i = 0;
                for (; i < list.length; i++) {
                  list[i].end ? list.splice(i--, 1) : list[i]();
                };
                !list.length && stop();
            },
        
            // ֹͣ���ж�ʱ������
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
                // ���ͼƬ�����棬��ֱ�ӷ��ػ�������
                if(img.complete) {
                  ready.call(img);
                  load && load.call(img);
                  return;
                };
                width = img.width;
                height = img.height;
                // ���ش������¼�
                img.onerror = function() {
                    error && error.call(img);
                    onready.end = true;
                    img = img.onload = img.onerror = null;
                };
            
                // ͼƬ�ߴ����
                onready = function() {
                  newWidth = img.width;
                  newHeight = img.height;
                  if (newWidth !== width || newHeight !== height ||
                    // ���ͼƬ�Ѿ��������ط����ؿ�ʹ��������
                    newWidth * newHeight > 1024
                  ) {
                    ready.call(img);
                    onready.end = true;
                  };
                };
                onready();
            
                // ��ȫ������ϵ��¼�
                img.onload = function() {
                    // onload�ڶ�ʱ��ʱ��Χ�ڿ��ܱ�onready��
                    // ������м�鲢��֤onready����ִ��
                    !onready.end && onready();
                    load && load.call(img);
                    // IE gif������ѭ��ִ��onload���ÿ�onload����
                    img = img.onload = img.onerror = null;
                };
            
                // ��������ж���ִ��
                if (!onready.end) {
                    list.push(onready);
                    // ���ۺ�ʱֻ�������һ����ʱ��������������������
                    if (intervalId === null) intervalId = setInterval(tick, 40);
                }
            };
        },

        //��Ⱦ���нṹ
        _bindStructure: function() {
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
        //�ж��Ƿ�������ﵽ�ײ��ٽ��
        isGetBottom: function() {
            /********************   
            * ȡ���ڹ������߶�    
            ******************/    
            function getScrollTop() {     
                var scrollTop=0;     
                if(document.documentElement&&document.documentElement.scrollTop){     
                    scrollTop=document.documentElement.scrollTop;     
                }else if(document.body){     
                    scrollTop=document.body.scrollTop;     
                }     
                return scrollTop;     
            }     
            /********************   
            * ȡ���ڿ��ӷ�Χ�ĸ߶�    
            *******************/    
            function getClientHeight() {     
                var clientHeight=0;     
                if(document.body.clientHeight&&document.documentElement.clientHeight){     
                    var clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;             
                }else{     
                    var clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;         
                }     
                return clientHeight;     
            }     
                
            /********************   
            * ȡ�ĵ�����ʵ�ʸ߶�    
            *******************/    
            function getScrollHeight() { 
                return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);     
            }
            if(getScrollTop()+getClientHeight() >= getScrollHeight() - 400) {
                return true;
            }     
            return false;
        },
        /**
         * ��ȡ�߶���СϪ��
         */
        getShortBrook: function() {
            var self = this,
                sBrook,
                bh = self.basicHeight,
                brooks = self.brooks,
                len = brooks.length;
                
            if (bh.length === 0) {
                for(var j=0; j < len; j++){
                    bh[j] = 0;
                }
            }
            for(var i = 0; i < len; i++) {
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
         * /��һ���������Ķ���������Ⱦ
         * ʵ���ٲ�����Ⱦ��ɵĻص�������ԭ��
         *      1.�ж�isLastTime�����Ƿ�Ϊ��
         *      2.���1���㣬����ÿ����Ⱦitems��Աʱ����addNum��1�����ж��Ƿ�addNum����sumNum��Ϊ����ִ���ٲ�����Ⱦ��ɻص�
         * ��ôʵ�ֵ�ԭ����ÿ����Ⱦ����һ���첽�Ĺ��̣���ȷ����һ��item���������Ⱦ��ɣ����Լ������жϲſ���
         */
        success: function(items, isLastTime) {
            var self = this,
                sumNum = items.length,
                addNum = 0;
            
            console.log('mark');
            
            if(items.length === 0) {
                return;
            }
            /*
            if (self.isLastTime) {//ִ�й�end����������Ϊtrue
                console.log('renderComplete haha');
                self.renderComplete.apply(self);
                 return;
            }*/
            
            showItems(items);
            function showItems(items) {
                var num = 0,
                    maxNum = items.length;
                    
                showItem(items, num);
                function showItem(items, num) {
                    
                    function delay(items, num) {
                        return function() {
                            var image = D.get('.' + self.imageClass, items[num]);
                            D.css(items[num], 'opacity', '0');  
                            if (image) {//��ͼƬ
                                self.imgReady(items[num], D.attr(image, 'src'), function() {
                                    renderStart({
                                        img: this,
                                        item: false
                                    }, num, maxNum);
                                });
                                return;
                            }
                            //��ͼƬ
                            renderStart({
                                img: false,
                                item: items[num]
                            }, num, maxNum);
                        }
                    }
                    timer = setTimeout(delay(items, num));
                }
                //obj���Ǹ����ڼ���ͼƬ�ߴ����ɵ�imgʵ��
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
                    } else if (obj.item) {
                        var item = obj.item,
                            imgData = {
                                isHasImg: false,
                                height: 0,
                                width : 0
                            };
                    } else {
                        throw new Error('renderStart error!');
                    }
                    //����ǰ�ص�
                    if(self.insertBefore) self.insertBefore.call(item, imgData);
                    //�����ص�
                    D.append(items[num], con);
                    if(self.insertAfter) self.insertAfter.call(item, imgData);
                    
                    
                   
                    new S.Anim(items[num] , {'opacity' : '1'} , 2 , 'easeOut', function() {
                        if (self.itemComplete) self.itemComplete.apply(item, imgData);
                        
                        if (self.isLastTime && self.renderComplete) {
                            addNum++;
                        }
                        
                        if (self.isLastTime && self.renderComplete){
                            console.log('addNum='+addNum +';sumNum='+ sumNum + ';num='+num);
                        }
                        
                        if (self.isLastTime && self.renderComplete && addNum === sumNum) {
                            console.log('renderComplete');
                            self.renderComplete.apply(self);
                            self.renderComplete.isExe = true;
                        }
                    }).run();
                    num++;
                    if (num < maxNum) {
                        showItem(items, num);
                        //�ظ����뱨��
                        if(items[num-1] === items[num]){
                            alert('error');
                        }
                    }
                    
                }
            }
            
        },
        //ֹͣ�첽����
        end: function() {
            var self = this;
            self.isEnd = true;
            E.remove(window, 'scroll', self.scrollFn);
            self.isLastTime = true;//������һ����Ⱦ��������Ҫ�ٲ�����Ⱦ��ɺ�ִ�лص�
            console.log('self.isLastTime = true')
        },
        /**
         * end֮�����¿�ʼ��Ⱦ���緭ҳЧ��
         */
        /*
        restart: function() {
            var self = this,
                brooks = self.brooks,
                len = brooks.length;
            //ȷ���Ѿ�����
            if(!self.isEnd){
                self.end();
            }
            
            self.isEnd = true;
            //����ȡһ��СϪ������listģʽ�л�֮�󣬻����µģ�����ȡ����
            self.brooks = D.query('.'+ self.brookName);
            //���СϪ������
            for(var i=0; i<len; i++) {
                D.html(brooks[i], '');
            }
            self._bindEvent();
        },
        */
        //���¼�
        _bindEvent: function() {
            var self = this;
            self.scrollFn = function() {
                if (!self.isGetBottom()) return;//������δ�ﵽҳβ�򷵻�
                self.load(self.success, self.end, self);
            }
            E.on(window, 'scroll', self.scrollFn);
            self.load(self.success, self.end, self);
        }
    });
    S.Waterfall = Waterfall;
    return Waterfall;
});
       