/*
 * @fileoverview����������ҳ�룬��ie6����ʹ����pagePrefix��pagePostfix��ԭʼcss�ļ�������ʽ���⣬��Ҫ����
 * @author��baohe.oyt
 * @version��1.0
 * @time��2012-3-31
 * <ul>
 * <li>pageSum:(number) ҳ������</li>
 * <li>pageShowNum:(number) ��ʾ��ҳ�������Ĭ��Ϊ6</li>
 * <li>pagePrefix:(string) ҳ�����ֵ�ǰ׺���硰(����,Ĭ��Ϊ��</li>
 * <li>pagePostfix:(string) ҳ�����ֵĺ�׺���硰)����,Ĭ��Ϊ��</li>
 * <li>currentPage:(number) ��ǰҳ��ҳ�룬Ĭ��Ϊ1</li>
 * <li>callback:(function) ������ҳ��Ļص�����</li>
 * </ul>
 */
KISSY.add('pagination', function(S) {
    var D = S.DOM,E = S.Event,UA = S.UA;
     /**
     * KISSY.Pagination���캯��
     * @param content {String} ����ҳ�������id
     * @param config {Object} ����
     */
    function Pagination(content, config) {
        var self = this;
        if(S.isString(content)) {
            self.content = D.get(content);
        }
        if(!content) {
            S.log('��������ȷ��id.');
            return;
        }
        self._init(config || {});
    }
    /**
     * KISSY.Paginationԭ����չ
     */    
    S.augment(Pagination, {
        /**
         * @private
         * @param config {Object}
         */
        _init: function(config) {
            var self = this;
            self.jumpTo = self.renderPage;
            self._buildParam(config).renderPage(self.currentPage, true)._buildEvent();
            return self;
        },
        /**
         * @private
         * @param o {Object}
         */
        _buildParam: function(o) {
            var self = this;
            self.pageSum = (typeof o.pageSum == 'undefined' || o.pageSum == null) ? false : o.pageSum;
            self.pageShowNum = (typeof o.pageShowNum == 'undefined' || o.pageShowNum == null) ? 6 : o.pageShowNum;
            self.pagePrefix = (typeof o.pagePrefix == 'undefined' || o.pagePrefix == null) ? '' : o.pagePrefix;
            self.pagePostfix = (typeof o.pagePostfix == 'undefined' || o.pagePostfix == null) ? '' : o.pagePostfix;
            self.currentPage = (typeof o.currentPage == 'undefined' || o.currentPage == null) ? 1 : o.currentPage;
            self.callback = (typeof o.callback == 'undefined' || o.callback == null || typeof o.callback != 'function') ? false : o.callback;
            
            return self;
        },
        /**
         * ��Ⱦ�ڵ�&�л���ǰҳ����ҳ��
         * @param currentPage {number}
         */
        renderPage: function(currentPage, isFirstTime) {
            var self = this,numCon = '',htmlDom,
                rightNum = parseInt(self.pageShowNum / 2),
                leftNum = self.pageShowNum - rightNum,
                currentPage = (currentPage < 1 || currentPage == NaN) ? 1 : currentPage,
                currentPage = (currentPage > self.pageSum) ? self.pageSum : currentPage,
                seachInput = (currentPage >= self.pageSum) ? currentPage : (currentPage+1);
                
            function createNum(i, l) {
                var str = '';
                for(; i<l; i++) {
                    if((i+1) == currentPage) {
                        str += '<a class="num page-cur" href="javascript:void(0);">'+ self.pagePrefix +'<span class="digit">'+ (i+1) +'</span>'+ self.pagePostfix +'</a>';
                    } else {
                        str += '<a class="num" href="javascript:void(0);">'+ self.pagePrefix +'<span class="digit">'+ (i+1) +'</span>'+ self.pagePostfix +'</a>';
                    }
                }
                return str;
            }
            
            if(self.pageSum <= self.pageShowNum) {//�������ܸ���
                numCon = createNum(0,self.pageSum);
            } else if((currentPage - leftNum > 0) && (currentPage + rightNum < self.pageSum)) {//���м�
                numCon = createNum(currentPage - leftNum, currentPage + rightNum);
                numCon += '<span class="page-break dot">...</span>';
            } else if(currentPage - leftNum <= 0) {//����
                numCon = createNum(0, self.pageShowNum);
                numCon += '<span class="page-break dot">...</span>';
            } else if(currentPage + rightNum >= self.pageSum){//����
                numCon = createNum(self.pageSum - self.pageShowNum, self.pageSum);
            } else {
                alert('error!');
            }
            
            self.currentPage = currentPage;
            D.val(D.get('.searchInput', self.content), seachInput);
            
            var prevBtn = (self.currentPage == 1)? 'hidden' : '',
                nextBtn = (self.currentPage == self.pageSum)? 'hidden' : '',
                htmlReplaceStr =  '<a class="page-prev '+ prevBtn +'" href="javascript:void(0);"><span class="J_prev">��һҳ</span></a>'+
                                  numCon+
                                  '<a class="page-next '+ nextBtn +'" href="javascript:void(0);"><span class="J_next">��һҳ</span></a>';
            
            if(isFirstTime) {//������Ⱦ
                var htmlStr = '<div class="pagination">'+
                            '<div class="page-bottom">'+
                            '<div class="replace-box">'+
                            htmlReplaceStr+
                            '</div>'+
                            '<span class="page-skip">'+
                            '<span id="filterPageForm" name="filterPageForm">'+
                            '��'+ self.pageSum +'ҳ����'+
                            '<input type="text" title="ָ��ҳ��" name="jumpto" id="jumpto" class="searchInput" size="3" value="'+ seachInput +'">'+
                            'ҳ'+
                            '<button title="ָ��ҳ��" type="submit" class="J_jumpButton">ȷ��</button>'+
                            '</span>'+
                            '</span>'+
                            '</div>'+
                            '</div>';
                htmlDom = D.create(htmlStr);
                var contentBox = D.get('#J_page');
                D.html(contentBox, '');
                D.append(htmlDom, contentBox);
            } else {//�ǳ��μ���
                htmlDom = D.create(htmlReplaceStr);
                var replaceBox = D.get('.replace-box', self.content);
                D.html(replaceBox, '');
                D.append(htmlDom, replaceBox);
            }
            return self;
        },
        /**
         * @private
         * ���¼�
         */
        _buildEvent: function() {
            var self = this;
            function prevPage(){//��һҳ
                if(self.currentPage - 1 >= 1){
                    self.jumpTo(self.currentPage - 1);
                    return true;
                }
                return false;
            }
            function nextPage(){//��һҳ
                if(self.currentPage + 1 <= self.pageSum){
                    self.jumpTo(self.currentPage + 1);
                    return true;
                }
                return false;
            }
            
            E.on(self.content, 'click', function(e) {
                var tar = e.target,isJump = true;
                switch(D.attr(tar, 'class')) {
                    case 'num'://ҳ�����
                        var newPage = parseInt(D.html(D.get('.digit', tar)));
                        self.jumpTo(newPage);
                        break;
                    case 'digit'://ҳ������
                        var newPage = parseInt(D.html(D.get(tar)));
                        self.jumpTo(newPage);
                        break;
                    case 'page-prev'://��һҳ
                    case 'J_prev':
                        prevPage();
                        break;
                    case 'page-next'://��һҳ
                    case 'J_next':
                        nextPage();
                        break;
                    case 'J_jumpButton'://����ҳ��
                        var newPage = parseInt(D.val(D.get('#jumpto')));
                        newPage = (newPage) ? newPage : 1;
                        self.jumpTo(newPage);
                        break;
                    default:
                        isJump = false;
                        break;
                };
                if(isJump && self.callback) self.callback(self.currentPage);//���ҳ���ص�����
            });
            // E.on(D.get('#jumpto'), 'focusin', function(e) {
                // var tar = e.currentTarget,isJump = true;
                // E.on(document, 'keydown', function(ev) {
                    // switch(ev.keyCode){
                        // case 13://����enter
                            // var newPage = parseInt(D.val(tar));
                            // newPage = (newPage) ? newPage : 1;
                            // if(newPage != self.currentPage) self.jumpTo(newPage);
                            // break;
                        // case 38://���ϡ�����=>��һҳ
                        // case 39:
                            // isJump = nextPage();
                            // break;
                        // case 37://��������=>��һҳ
                        // case 40:
                            // isJump = prevPage();
                            // break;
                        // default:
                            // isJump = false;
                            // break;
                    // };
                    // if(isJump && self.callback) self.callback(self.currentPage);//���ҳ���ص�����
                // });
            // });
            // E.on(D.get('#jumpto'), 'focusout', function(e) {
                // E.detach(document, 'keydown');
            // });
            return self;
        }
    }, false);

    S.Pagination = Pagination;
    return Pagination;
});
