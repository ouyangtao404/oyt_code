<?php
$jsoncallback=$_GET["jsoncallback"]
echo <<<EOF
{$jsoncallback}({"data":[
EOF;
echo <<<EOF
    {
        "title": "巧妙用点小心机 俗女立刻潮上位",
        "clickTimes": "7",
        "publisthData": "2012-04-24",
        "abstract": "春天已经走到了尾声，暖风吹响了夏天到来的号角，在这个时候，衣橱也是时候大换血了，过时的，旧的，通通都抛掉，让我们一起来迎接焕然一新的夏季，当然是离不开新的衣服和装扮呢。",
        "picture": "http://img01.taobaocdn.com/tps/i1/T1PY2XXbVdXXXXXXXX.jpg"
    },
    {
        "title": "巧妙用点小心机 俗女立刻潮上位222",
        "clickTimes": "73",
        "publisthData": "2012-04-21",
        "abstract": "春天已123123经走到了尾声，暖风吹响了夏天到来的号角，在这个时候，衣橱也是时候大换血了，过时的，旧的，通通都抛掉，让我们一起来迎接焕然一新的夏季，当然是离不开新的衣服和装扮呢。",
        "picture": "http://img01.taobaocdn.com/tps/i1/T1PY2XXbVdXXXXXXXX.jpg"
    }
   ]
})
EOF;
?>
//jsonp26({"stat":"fail", "code":100, "message":"Invalid API Key (Key has invalid format)"})