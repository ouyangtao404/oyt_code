/*
 * @fileoverview：用于生成页码，在ie6里，如果使用了pagePrefix和pagePostfix，原始css文件会有样式问题，需要调整
 * @author：baohe.oyt
 * @version：1.0
 * @time：2012-3-31
 * <ul>
 * <li>pageSum:(number) 页码总数</li>
 * <li>pageShowNum:(number) 显示的页码个数，默认为6</li>
 * <li>pagePrefix:(string) 页码数字的前缀（如“(”）,默认为空</li>
 * <li>pagePostfix:(string) 页码数字的后缀（如“)”）,默认为空</li>
 * <li>currentPage:(number) 当前页的页码，默认为1</li>
 * <li>callback:(function) 翻到新页面的回调函数</li>
 * </ul>
 */
KISSY.add('pagination', function(S) {
    var D = S.DOM,E = S.Event,UA = S.UA;
     /**
     * KISSY.Pagination构造函数
     * @param content {String} 生成页码的容器id
     * @param config {Object} 配置
     */
    function Pagination(content, config) {
        var self = this;
        if(S.isString(content)) {
            self.content = D.get(content);
        }
        if(!content) {
            S.log('请配置正确的id.');
            return;
        }
        self._init(config || {});
    }
    /**
     * KISSY.Pagination原型扩展
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
         * 渲染节点&切换当前页到新页码
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
            
            if(self.pageSum <= self.pageShowNum) {//不超过总个数
                numCon = createNum(0,self.pageSum);
            } else if((currentPage - leftNum > 0) && (currentPage + rightNum < self.pageSum)) {//靠中间
                numCon = createNum(currentPage - leftNum, currentPage + rightNum);
                numCon += '<span class="page-break dot">...</span>';
            } else if(currentPage - leftNum <= 0) {//靠左
                numCon = createNum(0, self.pageShowNum);
                numCon += '<span class="page-break dot">...</span>';
            } else if(currentPage + rightNum >= self.pageSum){//靠右
                numCon = createNum(self.pageSum - self.pageShowNum, self.pageSum);
            } else {
                alert('error!');
            }
            
            self.currentPage = currentPage;
            D.val(D.get('.searchInput', self.content), seachInput);
            
            var prevBtn = (self.currentPage == 1)? 'hidden' : '',
                nextBtn = (self.currentPage == self.pageSum)? 'hidden' : '',
                htmlReplaceStr =  '<a class="page-prev '+ prevBtn +'" href="javascript:void(0);"><span class="J_prev">上一页</span></a>'+
                                  numCon+
                                  '<a class="page-next '+ nextBtn +'" href="javascript:void(0);"><span class="J_next">下一页</span></a>';
            
            if(isFirstTime) {//初次渲染
                var htmlStr = '<div class="pagination">'+
                            '<div class="page-bottom">'+
                            '<div class="replace-box">'+
                            htmlReplaceStr+
                            '</div>'+
                            '<span class="page-skip">'+
                            '<span id="filterPageForm" name="filterPageForm">'+
                            '共'+ self.pageSum +'页到第'+
                            '<input type="text" title="指定页码" name="jumpto" id="jumpto" class="searchInput" size="3" value="'+ seachInput +'">'+
                            '页'+
                            '<button title="指定页码" type="submit" class="J_jumpButton">确定</button>'+
                            '</span>'+
                            '</span>'+
                            '</div>'+
                            '</div>';
                htmlDom = D.create(htmlStr);
                var contentBox = D.get('#J_page');
                D.html(contentBox, '');
                D.append(htmlDom, contentBox);
            } else {//非初次加载
                htmlDom = D.create(htmlReplaceStr);
                var replaceBox = D.get('.replace-box', self.content);
                D.html(replaceBox, '');
                D.append(htmlDom, replaceBox);
            }
            return self;
        },
        /**
         * @private
         * 绑定事件
         */
        _buildEvent: function() {
            var self = this;
            function prevPage(){//上一页
                if(self.currentPage - 1 >= 1){
                    self.jumpTo(self.currentPage - 1);
                    return true;
                }
                return false;
            }
            function nextPage(){//下一页
                if(self.currentPage + 1 <= self.pageSum){
                    self.jumpTo(self.currentPage + 1);
                    return true;
                }
                return false;
            }
            
            E.on(self.content, 'click', function(e) {
                var tar = e.target,isJump = true;
                switch(D.attr(tar, 'class')) {
                    case 'num'://页码外壳
                        var newPage = parseInt(D.html(D.get('.digit', tar)));
                        self.jumpTo(newPage);
                        break;
                    case 'digit'://页码数字
                        var newPage = parseInt(D.html(D.get(tar)));
                        self.jumpTo(newPage);
                        break;
                    case 'page-prev'://上一页
                    case 'J_prev':
                        prevPage();
                        break;
                    case 'page-next'://下一页
                    case 'J_next':
                        nextPage();
                        break;
                    case 'J_jumpButton'://搜索页码
                        var newPage = parseInt(D.val(D.get('#jumpto')));
                        newPage = (newPage) ? newPage : 1;
                        self.jumpTo(newPage);
                        break;
                    default:
                        isJump = false;
                        break;
                };
                if(isJump && self.callback) self.callback(self.currentPage);//点击页码后回调函数
            });
            // E.on(D.get('#jumpto'), 'focusin', function(e) {
                // var tar = e.currentTarget,isJump = true;
                // E.on(document, 'keydown', function(ev) {
                    // switch(ev.keyCode){
                        // case 13://按下enter
                            // var newPage = parseInt(D.val(tar));
                            // newPage = (newPage) ? newPage : 1;
                            // if(newPage != self.currentPage) self.jumpTo(newPage);
                            // break;
                        // case 38://向上、向右=>下一页
                        // case 39:
                            // isJump = nextPage();
                            // break;
                        // case 37://向左、向下=>上一页
                        // case 40:
                            // isJump = prevPage();
                            // break;
                        // default:
                            // isJump = false;
                            // break;
                    // };
                    // if(isJump && self.callback) self.callback(self.currentPage);//点击页码后回调函数
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
