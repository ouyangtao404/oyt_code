/**
 * @fileoverview personal-blog-header
 * @desc ���˲�����ҳͷ���������ڶ����Ż���Ĵ���
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
        ATTENTION_BUTTON_CLASS = 'J_eventAttention',//�ӹ�ע��ť��class
        POPWIN_SELECT_CLASS = 'dr-personal-blog-header-pop-up',//ѡ��Ƥ���ĵ�����class
        PERSONAL_INFO_CLASS = 'personalinfo',//������Ϣ����
        INTRODUCED_ONE_WORD_CLASS = 'J_popBoxWrap',//"һ�仰����"������
        
        PopWin,//������
        TextAreaCharsMax = 30, //"һ�仰����"��������ַ�����
        bgColor = ['#d9e3d8', '#a0c3dd', '#e2ead2', '#e1e2d4', '#ffffff', '#e5f4d0', '#ecf1d1', '#e5ebd8'];//��Ƥ���ı�����ɫ
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
         * ajax����
         * @param {String} url �����ַ
         * @param {String} type ��������
         * @param {Object} data �������
         * @param {Function} callback �ص�����
         * @param {String} dataType �������������
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
                        message: '�������'
                    });
                },
                dataType: dataType
            });
        },
        /**
         * �������ܣ����ϽǴ���
         * ����ԭ���Ĵ���ʹ�õ�cookie��������ʵû��Ҫ���ɵ��ˡ�
         */
        _popWin: function () {
            var self = this,
                currentTempletNum = parseInt(_O('.personal-blog-header .bd').attr('data-templet'), 10),
                huanFuTempletNum,
                topBtn = _O('.personal-blog-header .topbtn a');
            _O('.personal-blog-header .bg').css('background-color', bgColor[currentTempletNum]);
            topBtn.on('click', function (e) {
                var skinPopWin,//Ƥ��ѡ���
                    str,
                    n,
                    headerBg = _O('.personal-blog-header .bg'),
                    headBd = _O('.personal-blog-header .bd');
                skinPopWin = new PopWin([668,332]);
                str = '<section class="dr-personal-blog-header-pop-up"><header class="hd"></header><article class="bd"><ul class="clearfix"><li><a href="#" class="selected"><img src="http://img01.taobaocdn.com/tps/i1/T1IBbgXhtcXXac3k_h-172-95.png" /></a></li><li><a href="#" ><img src="http://img04.taobaocdn.com/tps/i4/T13knoXmVhXXac3k_h-172-95.png" /></a></li><li><a href="#" ><img src="http://img04.taobaocdn.com/tps/i4/T1_fHoXnddXXbA1k_h-172-95.jpg" /></a></li><li style="margin-right: 0px;"><a href="#" ><img src="http://img01.taobaocdn.com/tps/i1/T1RbbnXaloXXbA1k_h-172-95.jpg" /></a></li><li><a href="#" ><img src="http://img04.taobaocdn.com/tps/i4/T1fQjnXfBmXXbA1k_h-172-95.jpg" /></a></li><li><a href="#" ><img src="http://img03.taobaocdn.com/tps/i3/T1FNjnXh4nXXbA1k_h-172-95.jpg" /></a></li><li><a href="#" ><img src="http://img02.taobaocdn.com/tps/i2/T15dDnXhBnXXbA1k_h-172-95.jpg" /></a></li><li style="margin-right: 0px;"><a href="#" ><img src="http://img01.taobaocdn.com/tps/i1/T1c4HoXmdbXXbA1k_h-172-95.jpg" /></a></li></ul></article><footer class="ft"><div class="clearfix btn"><a href="#" class="save"></a><a href="#" class="exit"></a></div></footer></section>';
                skinPopWin.setContent(str);
                skinPopWin.show();
                /**
                 * ѡ��Ƥ��
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
                 * �˳�������
                 */
                E.on('.'+ POPWIN_SELECT_CLASS +' .exit', 'click', function (e) {
                    headerBg.css('background-color', bgColor[currentTempletNum]);
                    headBd.attr('class', headBd.attr('class').replace(/bg[0-9]+/g, 'bg' + currentTempletNum));
                    skinPopWin.remove();
                });
                /**
                 * �˳����� 
                 */
                E.on('.'+ POPWIN_SELECT_CLASS +' .save', 'click', function (e) {
                    self._ajax(
                        self.config.changeSkinUrl, 
                        {
                            'skin': huanFuTempletNum
                        },
                        function (msg) {
                            //����Ĭ��ÿ�����󶼳ɹ�������������Ҫ�������뿪������
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
         * �༭"һ�仰����"�������ַ�����
         */
        _limitTextAreaChars: function (textArea) {
            var self = this,
            textAreaValue = textArea.value;
            if (textAreaValue.length > TextAreaCharsMax) {
                textArea.value = textAreaValue.substring(0, TextAreaCharsMax);
            }
        },
        /**
         * "һ�仰����"���޸ĵ�����
         */
        _changeIntroductionPopWin: function (e) {
            e.halt();
            var self = this,
                isModify = D.hasClass(e.target, 'editdesc'),//�Ƿ�Ϊ�޸�
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
                str = '<div class="'+ containerClass +'"><div class="hd"><h5>һ�仰���ܣ�</h5></div><div class="bd"><textarea>'+ defaultTextAreaValue +'</textarea><div class="tishi">��������30����</div></div><div class="ft-btn"><a href="#" class="ok">ȷ��</a><a href="#" class="close">ȡ��</a></div></div>';
            introductionPopWin.setContent(str);
            introductionPopWin.show();
            textArea = _O('.'+ containerClass).one('textarea');
            okBtn = _O('.'+ containerClass).one('.ok');
            closeBtn =  _O('.'+ containerClass).one('.close');
            //���������һ���仯�ͼ���ַ�����
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
             * �޸ġ�"һ�仰����"��������ص�
             */
            function modifyCallback(msg) {
                var self = this;
                if (msg && msg.type == 1) {
                    if(textArea.val() === '') {
                        personalInfoContainer.one('.infoedit em').remove();
                        personalInfoContainer.one('.infoedit').html('<em class="hidd">����<a class="createdesc" href="#">����һ���Լ�</a>����ø����˹�ע�ɣ�</em>');
                        introductionPopWin.remove();
                        return;
                    }
                    personalInfoContainer.one('.infoedit').html('<em>'+ textArea.val() +'</em><a class="editdesc" href="#">�޸�</a>');
                    introductionPopWin.remove();
                    return;
                } 
                introductionPopWin.remove();
                errorPopWin = new PopWin([309,120]);
                errorPopWin.setContent('<article class="'+ ERROR_POP_WIN_CLASS +'">'+ msg.message +'<a href="#" class="'+ ERROR_POP_WIN_CLOSE_CLASS +'">�ر�</a></article>');
                errorPopWin.show();
                E.delegate('.'+ERROR_POP_WIN_CLASS, 'click', '.'+ERROR_POP_WIN_CLOSE_CLASS, function (e){
                    e.halt();
                    errorPopWin.remove();
                });
            }
        },
        /**
         * �༭"һ�仰����"
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