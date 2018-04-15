$ui.render({
    props: {
        title: "short link"
    },
    views: [{
        type: "input",
        props: {
            placeholder: "URL"
        },
        layout: function (make, view) {
            make.height.equalTo(40)
            make.left.equalTo(20)
            make.right.inset(80)
            make.center.equalTo(0)
        },
    },
    {
        type: "button",
        props: {
            title: "轉 換"
        },
        layout: function (make, view) {
            make.top.equalTo($("input"))
            make.height.equalTo($("input"))
            make.width.equalTo(60)
            make.right.equalTo($("input").right).offset(70)
        },
        events: {
            tapped: function () {
                $("input").blur(),
                    get_short_link($("input").text)
            }
        }
    },
    {
        type: "label",
        props: {
            font: $font(30)
        },
        layout: function (make, view) {
            make.left.right.equalTo(40)
            make.top.equalTo($("input").bottom).offset(20)
        },
        events: {
            tapped: function () {
                $ui.toast("已複製！"),
                    $clipboard.text = $("label").text
            }
        }
    }]
})

function get_short_link(text) {
    $http.get({
        url: "https://api.weibo.com/2/short_url/shorten.json?source=1681459862&url_long=" + text,
        handler: function (resp) {
            var data = resp.data
            $("label").text = data.urls[0]["url_short"]
        }
    })
}