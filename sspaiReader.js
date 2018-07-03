var __width = $device.info["screen"]["width"],
    __height = $device.info['screen']["height"]

$ui.render({
    props: {
        title: "少数派",
        navBarHidden: true,
        statusBarStyle: 0,
    },
    views: [{
        type: "view",
        props: {
            id: "mainView",
        },
        layout: $layout.fill,
        views: [
            {
                type: "image",
                props: {
                    id: "logo",
                    radius: 18,
                    src: "https://cdn.sspai.com/sspai/assets/img/favicon/icon_152.png"
                },
                layout: function (make, view) {
                    make.top.equalTo(20)
                    make.left.equalTo(10)
                    make.size.equalTo($size(50, 50))
                }
            },
            {
                type: "label",
                props: {
                    id: "title",
                    text: "少数派",
                    font: $font("bold", 30),
                    align: $align.center
                },
                layout: function (make, view) {
                    make.left.equalTo($("logo").right).offset(5)
                    make.top.equalTo($("logo")).offset(7)
                }
            },
            {
                type: "button",
                props: {
                    id: "RSSIcon",
                    icon: $icon("050", $color("gray"), $size(30, 30)),
                    bgcolor: $color("clear")
                },
                layout: function (make, view) {
                    make.top.equalTo($("logo")).offset(7)
                    make.right.inset(10)
                },
                events: {
                    tapped: function (sender) {
                        $clipboard.text = "https://sspai.com/feed"
                        $ui.toast("RSS地址已复制", 1)
                    }
                }
            },
            {
                type: "button",
                props: {
                    id: "searchIcon",
                    icon: $icon("023", $color("gray"), $size(30, 30)),
                    bgcolor: $color("clear")
                },
                layout: function (make, view) {
                    make.top.equalTo($("logo")).offset(7)
                    make.right.equalTo($("RSSIcon").left).inset(15)
                },
                events: {
                    tapped: function (sender) {
                        $input.text({
                            type: $kbType.default,
                            placeholder: "搜索",
                            handler: function (text) {

                            }
                        })
                    }
                }
            },
            {
                type: "scroll",
                props: {
                    bgcolor: $color("tint"),
                    showsVerticalIndicator: false,
                },
                layout: function (make, view) {
                    make.top.equalTo($("logo").bottom).offset(5)
                    make.size.equalTo($size(__width, __height))
                },
                events: {
                    pulled: function(sender) {
                        $("scroll").endRefreshing()
                    }
                },
                views: []
            }
        ]
    }]
})
