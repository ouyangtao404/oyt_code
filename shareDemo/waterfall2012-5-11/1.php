<?php
$jsoncallback = $_GET["jsoncallback"]
?>
<?php

echo <<<EOF
{$jsoncallback}({"data":[
EOF;

echo <<<EOF
    {
        "title": "第一个啊圣诞快乐附件啊了酥颗点肌肤啊lsd看风景",
        "clickTimes": "7",
        "publisthData": "2012-04-24",
        "abstract": "1圣诞快乐附件上当了房间撒旦浪费空间阿里斯顿费晋康啊十六大费晋康啊是打翻了啊圣诞快乐附件啊圣诞快乐附件卡拉圣诞节飞拉萨的境况房间爱上当了房间啊圣诞快乐附件",
        "picture": "http://img01.taobaocdn.com/tps/i1/T1PY2XXbVdXXXXXXXX.jpg"
    },
    {
        "title": "第二个死定了看风景死定了看风景死定了看风景死定了看风景",
        "clickTimes": "73",
        "publisthData": "2012-04-21",
        "abstract": "2啊lsd看风景阿快lsd附件ask了大姐夫阿拉卡士大夫记录锁定阿拉山口订房间阿斯顿",
        "picture": "http://img01.taobaocdn.com/tps/i1/T1PY2XXbVdXXXXXXXX.jpg"
    }
   ]
})
EOF;
?>
