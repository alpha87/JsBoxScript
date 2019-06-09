var playerId = "882GJQ2L9";

$ui.loading("查询中...")

$http.request({
    method: "GET",
    url: `https://api.madn.xyz/api/v1/players/${playerId}/detail`,
    header: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16C101 MicroMessenger/7.0.4(0x17000428) NetType/WIFI Language/zh_CN",
        "Content-Type": "application/json",
        "Referer": "https://servicewechat.com/wx2f43ce5718df238c/101/page-frame.html",
        "Host": "api.madn.xyz",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcGVuaWQiOiJvREJnYjBmYVdzc3h3OW1RZmhPT3NjWkotSHRNIiwiZXhwIjoxNTkwMjg2MTQxLCJpc3MiOiJjcmFwaSJ9.fyLCUPP1bAWZstGECK1rzY91qUFA3wrnuKHa-EHsYAI"
    },
    handler: function (resp) {
        var data = resp.data;
        getMessage(data)
    }
})

function getMessage(data) {
    if (data.status == "0") {
        var flag = false;
        for (var i=0; i<data.data.chests.length; i++) {
            if (data.data.chests[i].name == "legendary-chest"){
                var flag = true;
                var legendaryNum = data.data.chests[i].index;
            }
        }
        if (flag) {
            var legendaryText = `距离下一个传奇宝箱 #${legendaryNum}`
        } else {
            var legendaryText = ""
        }
        var chestType = data.data.chests[0].name
        var chestName = `${chestType}.png`
        getImg(chestType)
        $ui.loading(false);
        $push.schedule({
            title: `玩家 ${data.data.name}`,
            body: `下一个宝箱将是...\n${legendaryText}`,
            attachments: [chestName]
        })
    } else {
        $ui.loading(false);
        $ui.alert({
            title: "查询失败",
            message: "请稍后查询！",
        });
    }
}

function getImg(chestType) {
    $http.download({
        url: `https://cdn.statsroyale.com/images/${chestType}.png`,
        showsProgress: false,
        progress: function (bytesWritten, totalBytes) {
            var percentage = bytesWritten * 1.0 / totalBytes
        },
        handler: function (resp) {
            $file.write({
                data: resp.data,
                path: `${chestType}.png`
            })
        }
    })
}

$push.clear();