/**
* Waterfall.js | �ٲ������
* @author baohe.oyt@taobao.com
* @class Waterfall
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
    * {
    * isHasImg: false/true,����ͼƬ���Լ��ߴ磬��ͼƬ�ߴ�Ϊ0
    * height: 100,
    * width : 200
    * };
* insertAfter:{function} ÿ��item����֮�󴥷���this�Ͳ���ͬinsetAfter
* itemComplete:{function} ÿ��item��ʾ������������ʾ���󴥷���thisΪ��item
* renderComplete:{function} ������Ϣ��Ⱦ��ɣ���ʵ��������isLastTimeΪ��ǣ��󴥷�
* 
* S.Waterfall��ʵ���ķ�����
* success:�����ݺͽṹ��Ϻõ��½�dom�ڵ㼯����Ϊ��һ���������룬���ݱ�����ٲ�����չʾ
*   �������һ����Ⱦ��ʱ�򣬴���һ������ֵtrue����Ϊ��ǣ���ϵ��renderComplete�Ĵ���
* end:��ֹ�ٲ�����Ⱦ
*/
KISSY.add('widgets/Waterfall/Waterfall', function(S, Template) {
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
            console.info('��������ȷ��id.');
            return;
        }
        self._init(config || {});
    }
    //�̳�base���������Զ����¼�
    S.extend(Waterfall, S.Base);
    //S.extend(Waterfall, S.EventTarget);
    //S.augment(Waterfall, S.EventTarget);
    S.augment(Waterfall, {
        _init: function(config) {
            var self = this;
            
            self.isEnd = false;
            self._bindParam(config);
            //��ʼ��һ�����߸�self.imgReady;
            self.imgReady = self._checkImgSizeInit();
            self._bindEvent();
        },
        //���ò���
        _bindParam: function(o) {
            var self = this,
                brooks;

            //�����еĲ�����û�����õ���Ҫ����
            if(!o.template || //template������
               (!o.brooks && (!o.container || !o.colCount || !o.colWidth))//ָ����Ϫ��  ��  ����Ϫ����3Ҫ�أ�������Ϫ����ȣ�Ϫ����������û��
            ) {
                console.info('brooks�����ڻ�container/colCount/colWidth�����ڣ�');
                return;
            }
            
            if(!o.brooks) {
                self.brooks = o.brooks = self._bindStructure();
            }
            
            function setParam(def, key) {
                var v = o[key];
                
                self[key] = (v === undefined || v === null)? def : v;
            }
            
            S.each({
                brookName: BROOK_NAME,
                brooks: false,
                colCount: false,
                colWidth: false,
                imageClass: false,
                template: false,
                index: 0,//������Ⱦ����
                callback: false
            }, setParam);
            
            // ��ȡϵ�еĻ����߶�
            function getBasicHeight() {
                var brooks = self.brooks,
                    len = brooks.length,
                    heightList = [];
                    
                for(var i=0; i<len; i++) {
                    heightList[heightList.length] = D.offset(brooks[i]).top;
                }
                return heightList;
            }
            self.basicHeight = getBasicHeight();
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
                    }
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
                }
                width = img.width;
                height = img.height;
                // ���ش������¼�
                E.on(img, 'error', function() {
                    error && error.call(img);
                    onready.end = true;
                    img = img.onload = img.onerror = null;
                });
            
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
                }
                onready();
            
                // ��ȫ������ϵ��¼�
                E.on(img, 'load', function() {
                    // onload�ڶ�ʱ��ʱ��Χ�ڿ��ܱ�onready��
                    // ������м�鲢��֤onready����ִ��
                    !onready.end && onready();
                    load && load.call(img);
                    // IE gif������ѭ��ִ��onload���ÿ�onload����
                    img = img.onload = img.onerror = null;
                });
            
                // ��������ж���ִ��
                if (!onready.end) {
                    list.push(onready);
                    // ���ۺ�ʱֻ�������һ����ʱ��������������������
                    if (intervalId === null) intervalId = setInterval(tick, 40);
                }
            };
        },

        //��Ⱦ���нṹ
        _bindStructure: function(){
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
            return D.query('.'+self.brookName, self.container);
        },
        //�ж��Ƿ�������ﵽ�ײ��ٽ��
        isGetBottom: function() {
            //ȡ���ڹ������߶�    
            function getScrollTop() {     
                var scrollTop = 0;     
                if(document.documentElement && document.documentElement.scrollTop) {     
                    scrollTop=document.documentElement.scrollTop;     
                }else if(document.body){     
                    scrollTop=document.body.scrollTop;     
                }     
                return scrollTop;     
            }     
            //ȡ���ڿ��ӷ�Χ�ĸ߶�    
            function getClientHeight() {     
                var clientHeight = 0;     
                if(document.body.clientHeight && document.documentElement.clientHeight){     
                    var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight)? document.body.clientHeight : document.documentElement.clientHeight;             
                }else{     
                    var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight)? document.body.clientHeight : document.documentElement.clientHeight;         
                }     
                return clientHeight;     
            }     
            //ȡ�ĵ�����ʵ�ʸ߶�    
            function getScrollHeight() { 
                return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);     
            }
            if(getScrollTop() + getClientHeight() >= getScrollHeight() - 400) {
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
         * �����ݺ�ģ�����ƴװ
         */
        _createDom: function(dataList) {
            var self = this,
                items = [],
                template = self.template;
            
            for(var i=0; i < dataList.length; i++) {
                items[items.length] = D.create(S.Template(template).render(dataList[i]));
            }
            return items;
        },
        /**
         * /��һ���������Ķ���������Ⱦ
         * ʵ���ٲ�����Ⱦ��ɵĻص�������ԭ�� 
         * @param dataList {array} ���ݼ��ϣ����ں�ģ��ƴװ�ɴ����
         * @param isLastTime {boolean} ��־�ǲ������һ����Ⱦ����Ҫ��dataList.length��Ϊ0��ʱ��Ϊtrue�������޷�����renderComplete�¼�
         */
        load: function(dataList, isLastTime) {
            var self = this;
            
            //�Ѿ������Ļ�ֱ�ӷ���
            if(self.isEnd) {
                console.info('do not execute function load after render is completed!');
                return;
            };
            
            if(dataList.length == 0) {
                if(self.isRenderComplete) {
                    return;
                }
                //�����˿յ���Ϣ,���ٲ�����������
                self.isRenderComplete = true;
                self.end();
                //�Ѵ�������д�������Ϊ���ܼ���������������������isRenderComplete��Ϊtrue����ʱ�����Էŵ����
                self.fire('renderComplete');
                return;
            }
            /**
             * ����й������Ĵ�����Ⱦ��ɵ�������(dataList.length > 0 && isLastTime)��,isRenderComplete��Ϊ�� 
             * ���¸�ֵ������if(self.isRenderComplete)return;���·����������´�loadִ�е�ʱ���õ�
             * д�����λ�ö�������renderComplete����֮���ԭ���ǣ�����·�����fire֮�������ã������´ε�load�ֿ�ʼִ�У���Ҫһ����ʱ�ı�־
             */
            self.isRenderComplete = (dataList.length > 0 && isLastTime)? true : false;
            
            var items = self._createDom(dataList),
                sumNum = items.length,
                addNum = 0;

            self.index++;
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
                        console.error('renderStart error!');
                    }
                    //����ǰ�ص�
                    if(self.callback.insertBefore) self.callback.insertBefore.call(item, imgData);
                    D.append(items[num], con);
                    //�����ص�
                    if(self.insertAfter) self.insertAfter.call(item, imgData);
                    if(num + 1 === sumNum && isLastTime) {
                        self.fire('renderComplete');
                        console.log('222');
                        self.end();
                    }
                    
                    new S.Anim(items[num] , {'opacity' : '1'} , 2 , 'easeOut', function() {
                        if (self.callback.itemComplete) self.callback.itemComplete.call(item, imgData);
                    }).run();
                    num++;
                    if (num < maxNum) {
                        showItem(items, num);
                        //�ظ����뱨��
                        if(items[num-1] === items[num]){
                            console.error('item repeat!');
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
        },
        //���¼�
        _bindEvent: function() {
            var self = this;
            
            self.scrollFn = function() {
            if (!self.isGetBottom()) return;//������δ�ﵽҳβ�򷵻�
                self.fire('scrollToEnd');
            }
            E.on(window, 'scroll', self.scrollFn);
            self.callback.ready.call(self);
        }
    });
    S.Waterfall = Waterfall;
    return Waterfall;
},{
    requires: ['template']
});
       