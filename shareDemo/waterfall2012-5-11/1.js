<?php
$jsoncallback=$_GET["jsoncallback"]
echo <<<EOF
{$jsoncallback}({"data":[
EOF;
echo <<<EOF
    {
        "title": "�����õ�С�Ļ� ��Ů���̳���λ",
        "clickTimes": "7",
        "publisthData": "2012-04-24",
        "abstract": "�����Ѿ��ߵ���β����ů�紵�������쵽���ĺŽǣ������ʱ���³�Ҳ��ʱ���Ѫ�ˣ���ʱ�ģ��ɵģ�ͨͨ���׵���������һ����ӭ�ӻ�Ȼһ�µ��ļ�����Ȼ���벻���µ��·���װ���ء�",
        "picture": "http://img01.taobaocdn.com/tps/i1/T1PY2XXbVdXXXXXXXX.jpg"
    },
    {
        "title": "�����õ�С�Ļ� ��Ů���̳���λ222",
        "clickTimes": "73",
        "publisthData": "2012-04-21",
        "abstract": "������123123���ߵ���β����ů�紵�������쵽���ĺŽǣ������ʱ���³�Ҳ��ʱ���Ѫ�ˣ���ʱ�ģ��ɵģ�ͨͨ���׵���������һ����ӭ�ӻ�Ȼһ�µ��ļ�����Ȼ���벻���µ��·���װ���ء�",
        "picture": "http://img01.taobaocdn.com/tps/i1/T1PY2XXbVdXXXXXXXX.jpg"
    }
   ]
})
EOF;
?>
//jsonp26({"stat":"fail", "code":100, "message":"Invalid API Key (Key has invalid format)"})