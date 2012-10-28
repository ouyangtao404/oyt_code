<?php
$jsoncallback = $_GET["jsoncallback"]
?>


<?php
echo <<<EOF
{$jsoncallback}({"data":[
EOF;

echo <<<EOF

        {
            "title": "asdfasdfasdf",
            "clickTimes": "3903",
            "publisthData": "2012-04-18",
            "abstract": "asdfasdfasd",
            "url": "",
            "picture": "http://img01.taobaocdn.com/tps/i1/T1toe_XgBaXXXXXXXX.jpg"
        },
        {
            "title": "asdfasdfasdf",
            "clickTimes": "8625",
            "publisthData": "2012-04-18",
            "abstract": "asdfasdf",
            "picture": "http://img01.taobaocdn.com/tps/i1/T1VaS_XnprXXXXXXXX.jpg"
        }
    ]
});
EOF
?>