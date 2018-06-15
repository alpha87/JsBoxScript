const anaUrl = {
    "MRJK": "http://www.82190555.com/index/qqvod.php?url=",
    "MT2T": "http://vip.mt2t.com/yun?url=",
    "XFSUB": "http://api.xfsub.com/index.php?url=",
    "SHENG": "http://api.shenqistudio.com/?url=",
    "DGUA": "http://www.dgua.xyz/webcloud/?url=",
    "XZJK": "http://goudidiao.com/?url=",
}

$ui.menu({
    items: ["XFSUB", "MRJK", "MT2T", "SHENG", "DHUA", "XZJK"],
    handler: function (title, idx) {
        if (title) {
            openVideoUrl(anaUrl[title])
        }
    }
})

function openVideoUrl(_url) {
    $ui.render({
        props: {
            title: "Vider"
        },
        views: [{
            type: "web",
            props: {
                url: _url + $clipboard.text
            },
            layout: $layout.fill
        }]
    })
}