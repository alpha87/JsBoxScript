var __width = $device.info["screen"]["width"]
var __height = $device.info['screen']["height"]

$http.get({
    url: "https://api.cc.163.com/v1/wapcc/liveinfo?gametype=9045&page=1",
    handler: function (resp) {
        var data = resp.data
        var liveName = data.data["game_name"]
        $("liveNameLabel").text = liveName
    }
})

$ui.render({
    props: {
        title: "CC Live"
    },
    views: [{
        type: "view",
        props: {
            id: ""
        },
        views: [
            {
                type: "label",
                props: {
                    id: "liveNameLabel",
                    autoFontSize: true,
                    shadowColor: $color("red"),
                    font: $font("bold", 24),
                    align: $align.center
                },
                layout: function (make, view) {
                    make.top.equalTo(5)
                    make.centerX.equalTo()
                },
                events: {
                    tapped: function (sender) {
                        $ui.toast("message")
                    }
                }
            },
            {

                type: "matrix",
                props: {
                    columns: 2,
                    spacing: 5,
                    itemHeight: 128,
                    scrollEnabled: false,
                    template: {
                        views: [ {
                            type: "image",
                            props: {
                                src: "http://cc.fp.ps.netease.com/file/5b3387c096dee43baed8e68bbkYrajM9"
                            },
                            layout: function (make, view) {
                                make.center.equalTo(view.super)
                                make.size.equalTo($size(__width/2.5, 100))
                            }
                        },{
                            type: "label",
                            props: {
                                text: "Hello, World!",
                                align: $align.center
                            },
                            layout: function (make, view) {
                                make.top.equalTo($("image").bottom)
                                make.centerX.equalTo()
                            }
                        },
                       ]
                    },
                },
                layout: function (make, view) {
                    make.top.equalTo($("liveNameLabel").bottom)
                    make.left.right.inset(5)
                    make.size.equalTo($size(__width, __height))
                },
            },
        ],
        layout: $layout.fill
    }]
})

$("matrix").data = [{
    loc_title: {
        text: "定位"
    }
}, {
    loc_title: {
        text: "北京"
    }
}, {
    loc_title: {
        text: "上海"
    }
}, {
    loc_title: {
        text: "太原"
    }
}, {
    loc_title: {
        text: "深圳"
    }
}, {
    loc_title: {
        text: "杭州"
    }
}, {
    loc_title: {
        text: "成都"
    }
}, {
    loc_title: {
        text: "天津"
    }
}]