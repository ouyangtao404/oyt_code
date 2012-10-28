/**
 * @fileoverview personal-blog-header
 * @desc 个人博文主页头部交互，第二期优化后的代码
 * @author baohe.oyt<ouyangtao404@qq.com>
 * @date 20120901
 * @version 1.0
 * @depends kissy, widgets/NewLogin/NewLogin, widgets/PopWin/PopWin
 */
KISSY.app('LEHUO');
LEHUO.namespace('personalBlogIndex');
LEHUO.personalBlogIndex = (function () {
    var S = KISSY, 
        D = S.DOM, 
        E = S.Event,
        _A = S.all,
        _O = S.one,
        
        WIN = window,
        DOC = document,
        ATTENTION_BUTTON_CLASS = 'J_eventAttention',//加关注按钮的class
        POPWIN_SELECT_CLASS = 'dr-personal-blog-header-pop-up',//选择皮肤的弹出框class
        PERSONAL_INFO_CLASS = 'personalinfo',//个人信息容器
        INTRODUCED_ONE_WORD_CLASS = 'J_popBoxWrap',//"一句话介绍"弹出框
        
        PopWin,//弹出框
        TextAreaCharsMax = 30, //"一句话介绍"限制最大字符数量
        bgColor = ['#d9e3d8', '#a0c3dd', '#e2ead2', '#e1e2d4', '#ffffff', '#e5f4d0', '#ecf1d1', '#e5ebd8'];//各皮肤的背景颜色
    return {
        config: {
            param : {},
            addAttentionUrl : '',
            changeSkinUrl : 'http://lehuo.taobao.com/ajax/skin.htm'
        },
        init: function () {
            var self = this,
                isGuest = _O('.personal-blog-header .topbtn')? false : true;
            if(isGuest){
                return;
            }
            S.ready(function() {
                S.use('widgets/PopWin/PopWin', function (S, Pop) {
                    PopWin = Pop;
                    self._popWin();
                    self._introductionEditor();
                });
            });
        },
        /**
         * ajax请求
         * @param {String} url 请求地址
         * @param {String} type 请求类型
         * @param {Object} data 请求参数
         * @param {Function} callback 回调函数
         * @param {String} dataType 请求的数据类型
         */
        _ajax: function (url, data, callback, type, dataType) {
            var type = type || 'GET',
                dataType = dataType || 'json';
            S.io({
                type: type,
                url: url,
                data: data,
                success: function (json){
                    callback(json);
                },
                error: function (){
                    callback({
                        type: 0,
                        message: '网络错误'
                    });
                },
                dataType: dataType
            });
        },
        /**
         * 换肤功能：右上角触发
         * 这里原来的代码使用到cookie，发现其实没必要，干掉了。
         */
        _popWin: function () {
            var self = this,
                currentTempletNum = parseInt(_O('.personal-blog-header .bd').attr('data-templet'), 10),
                huanFuTempletNum,
                topBtn = _O('.personal-blog-header .topbtn a');
            _O('.personal-blog-header .bg').css('background-color', bgColor[currentTempletNum]);
            topBtn.on('click', function (e) {
                var skinPopWin,//皮肤选择框
                    str,
                    n,
                    headerBg = _O('.personal-blog-header .bg'),
                    headBd = _O('.personal-blog-header .bd');
                skinPopWin = new PopWin([668,332]);
                str = '<section class="dr-personal-blog-header-pop-up"><header class="hd"></header><article class="bd"><ul class="clearfix"><li><a href="#" class="selected"><img src="http://img01.taobaocdn.com/tps/i1/T1IBbgXhtcXXac3k_h-172-95.png" /></a></li><li><a href="#" ><img src="http://img04.taobaocdn.com/tps/i4/T13knoXmVhXXac3k_h-172-95.png" /></a></li><li><a href="#" ><img src="http://img04.taobaocdn.com/tps/i4/T1_fHoXnddXXbA1k_h-172-95.jpg" /></a></li><li style="margin-right: 0px;"><a href="#" ><img src="http://img01.taobaocdn.com/tps/i1/T1RbbnXaloXXbA1k_h-172-95.jpg" /></a></li><li><a href="#" ><img src="http://img04.taobaocdn.com/tps/i4/T1fQjnXfBmXXbA1k_h-172-95.jpg" /></a></li><li><a href="#" ><img src="http://img03.taobaocdn.com/tps/i3/T1FNjnXh4nXXbA1k_h-172-95.jpg" /></a></li><li><a href="#" ><img src="http://img02.taobaocdn.com/tps/i2/T15dDnXhBnXXbA1k_h-172-95.jpg" /></a></li><li style="margin-right: 0px;"><a href="#" ><img src="http://img01.taobaocdn.com/tps/i1/T1c4HoXmdbXXbA1k_h-172-95.jpg" /></a></li></ul></article><footer class="ft"><div class="clearfix btn"><a href="#" class="save"></a><a href="#" class="exit"></a></div></footer></section>';
                skinPopWin.setContent(str);
                skinPopWin.show();
                /**
                 * 选择皮肤
                 */
                E.on('.'+ POPWIN_SELECT_CLASS +' .bd li a', 'click', function (e) {
                    e.halt();
                    var s, 
                        color,
                        currentTarget = _O(e.currentTarget),
                        selects = D.query('.'+ POPWIN_SELECT_CLASS +' .bd li a');
                    D.removeClass('.'+ POPWIN_SELECT_CLASS +' .hover', 'hover');
                    currentTarget.addClass('hover');
                    huanFuTempletNum = S.indexOf(currentTarget[0], selects);
                    headerBg.css('background-color', bgColor[huanFuTempletNum]);
                    headBd.attr('class', headBd.attr('class').replace(/bg[0-9]+/g, 'bg' + huanFuTempletNum));
                });
                /**
                 * 退出不保存
                 */
                E.on('.'+ POPWIN_SELECT_CLASS +' .exit', 'click', function (e) {
                    headerBg.css('background-color', bgColor[currentTempletNum]);
                    headBd.attr('class', headBd.attr('class').replace(/bg[0-9]+/g, 'bg' + currentTempletNum));
                    skinPopWin.remove();
                });
                /**
                 * 退出保存 
                 */
                E.on('.'+ POPWIN_SELECT_CLASS +' .save', 'click', function (e) {
                    self._ajax(
                        self.config.changeSkinUrl, 
                        {
                            'skin': huanFuTempletNum
                        },
                        function (msg) {
                            //这里默认每次请求都成功，不做报错，如要更新需与开发商量
                        }, 
                        'POST'
                    );
                    currentTempletNum = huanFuTempletNum;
                    headBd.attr('data-templet', currentTempletNum);
                    skinPopWin.remove();
                });
                
            });
        },
        /**
         * 编辑"一句话介绍"：限制字符数量
         */
        _limitTextAreaChars: function (textArea) {
            var self = this,
            textAreaValue = textArea.value;
            if (textAreaValue.length > TextAreaCharsMax) {
                textArea.value = textAreaValue.substring(0, TextAreaCharsMax);
            }
        },
        /**
         * "一句话介绍"的修改弹出框
         */
        _changeIntroductionPopWin: function (e) {
            e.halt();
            var self = this,
                isModify = D.hasClass(e.target, 'editdesc'),//是否为修改
                introductionPopWin = new PopWin([360,177]),
                containerClass = 'personal-blog-header-describe',
                textArea,
                str,
                okBtn,
                closeBtn,
                errorPopWin,
                personalInfoContainer = _O('.'+ PERSONAL_INFO_CLASS),
                defaultTextAreaValue = isModify? personalInfoContainer.one('.infoedit em').html() : '';
                ERROR_POP_WIN_CLASS = 'album-error',
                ERROR_POP_WIN_CLOSE_CLASS = 'error-info',
                str = '<div class="'+ containerClass +'"><div class="hd"><h5>一句话介绍：</h5></div><div class="bd"><textarea>'+ defaultTextAreaValue +'</textarea><div class="tishi">最多可输入30个字</div></div><div class="ft-btn"><a href="#" class="ok">确定</a><a href="#" class="close">取消</a></div></div>';
            introductionPopWin.setContent(str);
            introductionPopWin.show();
            textArea = _O('.'+ containerClass).one('textarea');
            okBtn = _O('.'+ containerClass).one('.ok');
            closeBtn =  _O('.'+ containerClass).one('.close');
            //输入框内容一旦变化就检查字符长度
            textArea.on("valuechange",function (e) {
               e.halt();
               self._limitTextAreaChars(e.currentTarget);
            });
            closeBtn.on('click',function (e) {
                e.halt();
                introductionPopWin.remove();
            });
            okBtn.on('click', function (e) {
                e.halt();
                self.config.param.desctext = encodeURIComponent(textArea.val());
                var data = {
                    '_tb_token_': self.config.param._tb_token_,
                    'userInfo': self.config.param.desctext
                };
                self._ajax(self.config.describeUrl, data, function(msg){
                    modifyCallback(msg);
                }, 'POST', 'json');
            });
            /**
             * 修改“"一句话介绍"”的请求回调
             */
            function modifyCallback(msg) {
                var self = this;
                if (msg && msg.type == 1) {
                    if(textArea.val() === '') {
                        personalInfoContainer.one('.infoedit em').remove();
                        personalInfoContainer.one('.infoedit').html('<em class="hidd">快来<a class="createdesc" href="#">介绍一下自己</a>，获得更多人关注吧！</em>');
                        introductionPopWin.remove();
                        return;
                    }
                    personalInfoContainer.one('.infoedit').html('<em>'+ textArea.val() +'</em><a class="editdesc" href="#">修改</a>');
                    introductionPopWin.remove();
                    return;
                } 
                introductionPopWin.remove();
                errorPopWin = new PopWin([309,120]);
                errorPopWin.setContent('<article class="'+ ERROR_POP_WIN_CLASS +'">'+ msg.message +'<a href="#" class="'+ ERROR_POP_WIN_CLOSE_CLASS +'">关闭</a></article>');
                errorPopWin.show();
                E.delegate('.'+ERROR_POP_WIN_CLASS, 'click', '.'+ERROR_POP_WIN_CLOSE_CLASS, function (e){
                    e.halt();
                    errorPopWin.remove();
                });
            }
        },
        /**
         * 编辑"一句话介绍"
         */
        _introductionEditor: function () {
            var self = this;
            E.delegate('.'+ PERSONAL_INFO_CLASS, 'click', '.createdesc', function (e) {
                self._changeIntroductionPopWin.call(self, e);   
            });
            E.delegate('.'+ PERSONAL_INFO_CLASS, 'click', '.editdesc', function (e) {
                self._changeIntroductionPopWin.call(self, e);   
            });
        }
    };
})(); 