KISSY.add({
        'pagination': {
            fullpath:"http://a.tbcdn.cn/apps/pegasuslife/pagination.js",
            cssfullpath:"http://a.tbcdn.cn/apps/pegasuslife/pagination.css"
        },
        'waterfall': {
            fullpath:"waterfall.js",
            cssfullpath:"waterfall.css"
        }
    });
KISSY.use("waterfall,ajax,template,pagination", function(S, Waterfall, io, Template) {
    var _A = S.all,D = S.DOM,_O = S.one,E = S.Event,UA = S.UA;
    
    function getCurrentPage(param){
        var link = document.location.href;
        var cp = link.split(param+'=');
        if(cp.length>1){
            cp = cp[1].split('&');
        }
        cp = parseInt(cp[0].split('#')[0])?parseInt(cp[0].split('#')[0]):1;
        return cp;
    }
    function goToPage(page){
        if(document.location.href.indexOf('page=') != -1 ){//有page参数
            document.location.href = document.location.href.replace(/page=\d*/, 'page='+page);
        }else if(document.location.href.indexOf('?') != -1 ){//没有page参数，有问号
            document.location.href = document.location.href+'&page='+page;
        }else{
            document.location.href = document.location.href+'?page='+page;
        }
    }
    function renderPage(pageSumNum, currentPage){
        var page = new S.Pagination('#J_page', {
                            pageSum: pageSumNum,
                            currentPage: currentPage,
                            pageShowNum : 8,
                            callback: function(i){
                                goToPage(i);
                            }
                        });
    }
    function getUrlPrex(){
        var x = document.location.href.split('.php')[0].split('/');
        var pre='';
        for(var i=0;i<x.length-1;i++){
          pre += x[i]+'/';
        }
        return pre;
    }
    var screenNum = 4;
    var tpl = S.Template(_O('#tpl').html()),
    currentPage = getCurrentPage('page'),
    urlPrefix = 'http://fushi.taobao.com/list/1634/',
    currentPageSum = currentPage*screenNum,
    nextPage =  currentPage*screenNum-(screenNum-1);
    totalPage = 0;
    var waterfall = new S.Waterfall(
        "#ColumnContainer", //容器选择器
        {
	        load:function(requestSuccess, end) {//异步请求发送，请求成功后的html片段集合用requestSuccess渲染, end函数可以用于停止发送请求
	            if(totalPage){
	                if(nextPage > currentPageSum || nextPage > totalPage){
	                    renderPage(totalPage, currentPage);
	                    D.css(D.get('#detail-bottom'), 'display', 'block');
	                    D.css(D.get('#footer'), 'display', 'block');
	                    end();
	                    return;
	                }
	            }
	            S.ajax({
	                url: urlPrefix + (nextPage++) + '.php?tpl=waterfall-connector',
	                dataType: "jsonp",
	                jsonp: "jsoncallback",
	                success: function(d) {
	                    totalPage = d.totalPage;
	                    var data = d.data;
	                    var items = [];
	                    for(var i = 0; i < data.length; i++){
	                        var item = new S.Node(tpl.render(data[i]));//把一次请求的各项生成一系列对应html片段
	                        items.push(item);
	                    }
	                    requestSuccess(items, "#ColumnContainer");
	                }
	            });
	        },
	        colCount:4,
	        colWidth:222
        }
    );
});
