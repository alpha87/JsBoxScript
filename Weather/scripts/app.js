// 版本号
var __version = "v1.0";

// 存放实景图链接
var photoUrl = []

$app.tips("点击地区查询其他地区天气\n长按查看天气所在地实景图")

// 获取当地经纬度
function getLocation() {
    $location.fetch({
        handler: function (resp) {
            var lat = resp.lat
            var lng = resp.lng
            getWeather(lat, lng)
        }
    })
}

// 获取和风天气API数据
function getWeather(lat, lng) {
    $http.get({
        url: "https://free-api.heweather.com/s6/weather?location=" + lng + "," + lat + "&key=8fbe6ffd3b024bfba065104eaec87196",
        handler: function (resp) {
            var data = resp.data
            if (data.HeWeather6[0].status == "ok") {
                showData(false, data)
            } else {
                $ui.toast(data.HeWeather6[0].status.toUpperCase())
            }
        }
    })
}

// 获取制定位置API数据
function getLocWeather(text) {
    $http.get({
        url: "https://free-api.heweather.com/s6/weather?location=" + encodeURI(text) + "&key=8fbe6ffd3b024bfba065104eaec87196",
        handler: function (resp) {
            var data = resp.data
            if (data.HeWeather6[0].status == "ok") {
                showData(text, data)
            } else {
                $ui.toast(data.HeWeather6[0].status.toUpperCase())
            }
        }
    })
}

// 普通视图
function showData(text, wea) {
    // 接口基本数据
    var _basic = wea.HeWeather6[0].basic
    var parent_city = _basic.parent_city
    var area = _basic.admin_area != undefined ? _basic.admin_area : ""
    var location = _basic.location
    var update_date = wea.HeWeather6[0].update.loc
    var _now = wea.HeWeather6[0]["now"]
    var tmp = _now.tmp
    var cond_code = _now.cond_code
    var cond_text = _now.cond_txt
    var wind_dir = _now.wind_dir
    var wind_sc = _now.wind_sc
    var daily_forecast = wea.HeWeather6[0].daily_forecast
    var today_wea = daily_forecast["0"]
    var tomorrow_wea = daily_forecast["1"]
    var other_wea = daily_forecast["2"]

    getPhoto(parent_city)
    photoUrl.reverse()

    $ui.render({
        props: {
            title: "天气",
        },
        views: [{
            type: "views",
            props: {},
            layout: $layout.fill,
            views: [{
                    type: "image",
                    props: {
                        id: "local_png",
                        bgcolor: $rgba(100, 100, 100, 0),
                        src: "assets/icon_007.png"
                    },
                    layout: function (make, view) {
                        make.top.equalTo(20)
                        make.left.equalTo(55)
                        make.size.equalTo($size(18, 18))
                    }
                },
                {
                    type: "label",
                    props: {
                        id: "local",
                        font: $font("bold", 16),
                        text: parent_city !== location ? parent_city + location : parent_city,
                    },
                    layout: function (make, view) {
                        make.top.equalTo($("local_png"))
                        make.left.equalTo($("local_png")).offset(20)
                    },
                    events: {
                        tapped: function (sender) {
                            newWeather()
                        },
                        longPressed: function (sender) {
                            showPhoto()
                        }
                    }
                },
                {
                    type: "label",
                    props: {
                        id: "date",
                        font: $font("bold", 16),
                        text: today_wea.date.slice(0, 10),
                    },
                    layout: function (make, view) {
                        make.top.equalTo($("local"))
                        make.right.inset(50)
                    }
                },
                {
                    type: "button",
                    props: {
                        id: "settings",
                        icon: $icon("002", $color("#F5F5F5"), $size(20, 20)),
                        bgcolor: $color("clear"),
                    },
                    layout: function (make, view) {
                        make.right.inset(80)
                        make.bottom.inset(20)
                    },
                    events: {
                        tapped: function (sender) {
                            weatherSettings()
                        }
                    }
                },
                {
                    type: "button",
                    props: {
                        id: "feedback",
                        icon: $icon("030", $color("#F5F5F5"), $size(20, 20)),
                        bgcolor: $color("clear"),
                    },
                    layout: function (make, view) {
                        make.top.equalTo($("settings"))
                        make.right.inset(30)
                    },
                    events: {
                        tapped: function (sender) {
                            $system.mailto("jianxun2004@gmail.com")
                        }
                    }
                },
                {
                    type: "scroll",
                    props: {
                        radius: 18,
                        bgcolor: $cache.get("scrollColor") == undefined ? $color("#F5FFFA") : $cache.get("scrollColor").color,
                        showsVerticalIndicator: false,
                        alwaysBounceHorizontal: false,
                    },
                    layout: function (make, view) {
                        make.top.equalTo($("local").bottom).offset(20)
                        make.size.equalTo($size(360, 550))
                        make.centerX.equalTo();
                    },
                    events: {
                        pulled: function (params) {
                            if (text) {
                                getLocWeather(text);
                            } else {
                                getLocation();
                            }
                            $("scroll").endRefreshing()
                            $device.taptic(0)
                            $ui.toast("已刷新  " + update_date.slice(5), 0.5)
                        }
                    },
                    views: [{
                            type: "image",
                            props: {
                                id: "image",
                                src: 'assets/' + cond_code + '.png',
                                bgcolor: $rgba(100, 100, 100, 0),
                            },
                            layout: function (make, view) {
                                make.centerX.equalTo(-80)
                                make.centerY.equalTo(-220)
                                make.size.equalTo($size(90, 90))
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "tmp",
                                font: $font("bold", 55),
                                text: tmp + "℃",
                            },
                            layout: function (make, view) {
                                make.centerX.equalTo(40)
                                make.centerY.equalTo($("image"))
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "wind",
                                font: $font("bold", 14),
                                text: "🌬" + wind_dir + "  " + wind_sc + "mph / 💦 " + today_wea["pop"] + "%",
                            },
                            layout: function (make, view) {
                                make.centerX.equalTo(0)
                                make.centerY.equalTo($("tmp")).offset(60)
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "tmp_m",
                                font: $font("bold", 14),
                                text: cond_text + "  " + today_wea.tmp_min + "°" + " ~ " + today_wea.tmp_max + "°",
                            },
                            layout: function (make, view) {
                                make.centerX.equalTo(0)
                                make.centerY.equalTo($("wind")).offset(30)
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "today_info_s",
                                font: $font(14),
                                text: "日出：" + today_wea.sr + "    " + "日落：" + today_wea.ss,
                            },
                            layout: function (make, view) {
                                make.centerX.equalTo()
                                make.centerY.equalTo($("tmp_m")).offset(50)
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "today_info_m",
                                font: $font(14),
                                text: "月出：" + today_wea.mr + "    " + "月落：" + today_wea.ms,
                            },
                            layout: function (make, view) {
                                make.centerX.equalTo()
                                make.centerY.equalTo($("today_info_s")).offset(30)
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "today_info_c",
                                font: $font(14),
                                text: "日间：" + today_wea.cond_txt_d + "    " + "夜间：" + today_wea.cond_txt_n,
                            },
                            layout: function (make, view) {
                                make.centerX.equalTo()
                                make.centerY.equalTo($("today_info_m")).offset(50)
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "today_info_uv",
                                font: $font(14),
                                text: "紫外线强度指数：" + today_wea.uv_index,
                            },
                            layout: function (make, view) {
                                make.centerX.equalTo()
                                make.centerY.equalTo($("today_info_c")).offset(30)
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "today_info_w",
                                font: $font(14),
                                text: "风力：" + today_wea.wind_sc + "级",
                            },
                            layout: function (make, view) {
                                make.centerX.equalTo()
                                make.centerY.equalTo($("today_info_uv")).offset(50)
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "today_info_uv",
                                font: $font(14),
                                text: "相对湿度：" + today_wea.hum + "%",
                            },
                            layout: function (make, view) {
                                make.centerX.equalTo()
                                make.centerY.equalTo($("today_info_w")).offset(30)
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "tomo_date",
                                font: $font("bold", 20),
                                text: tomorrow_wea.date.slice(5),
                            },
                            layout: function (make, view) {
                                make.left.equalTo($("image")).offset(-10)
                                make.top.equalTo($("today_info_uv").bottom).offset(40)
                            }
                        },
                        {
                            type: "image",
                            props: {
                                id: "tomo_image",
                                src: 'assets/' + tomorrow_wea.cond_code_d + '.png',
                                bgcolor: $rgba(100, 100, 100, 0),
                            },
                            layout: function (make, view) {
                                make.size.equalTo($size(30, 30))
                                make.right.equalTo($("tomo_date").right).offset(70)
                                make.centerY.equalTo($("tomo_date"))
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "tomo_cond",
                                font: $font("bold", 20),
                                text: tomorrow_wea.cond_txt_d,
                            },
                            layout: function (make, view) {
                                make.right.equalTo($("tomo_image").right).offset(40)
                                make.centerY.equalTo($("tomo_date"))
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "tomo_wea_tmp",
                                font: $font("bold", 17),
                                text: tomorrow_wea.tmp_min + "°" + " ~ " + tomorrow_wea.tmp_max + "°",
                            },
                            layout: function (make, view) {
                                make.top.equalTo($("tomo_cond"))
                                make.right.equalTo($("tomo_cond").right).offset(110)
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "oth_date",
                                font: $font("bold", 20),
                                text: other_wea.date.slice(5),
                            },
                            layout: function (make, view) {
                                make.left.equalTo($("tomo_date"))
                                make.centerY.equalTo($("tomo_date").bottom).offset(40)
                            }
                        },
                        {
                            type: "image",
                            props: {
                                id: "oth_image",
                                src: 'assets/' + other_wea.cond_code_d + '.png',
                                bgcolor: $rgba(100, 100, 100, 0),
                            },
                            layout: function (make, view) {
                                make.size.equalTo($size(30, 30))
                                make.right.equalTo($("tomo_image").right)
                                make.centerY.equalTo($("oth_date"))
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "oth_cond",
                                font: $font("bold", 20),
                                text: other_wea.cond_txt_d,
                            },
                            layout: function (make, view) {
                                make.right.equalTo($("oth_image").right).offset(40)
                                make.centerY.equalTo($("oth_date"))
                            }
                        },
                        {
                            type: "label",
                            props: {
                                id: "oth_wea_tmp",
                                font: $font("bold", 17),
                                text: other_wea.tmp_min + "°" + " ~ " + other_wea.tmp_max + "°",
                            },
                            layout: function (make, view) {
                                make.top.equalTo($("oth_cond"))
                                make.right.equalTo($("tomo_wea_tmp"))
                            }
                        },
                    ]
                }
            ]
        }]
    })
}

// 展示输入位置天气

/* 
TODO 
热门城市用matrix展示
缓存查询城市用列表展示
*/
function newWeather() {
    $ui.push({
        props: {
            title: "搜索"
        },
        views: [
            {
                type: "input",
                props: {
                    id: "loc_input",
                    placeholder: "输入地区查询",
                    radius: 15,
                },
                layout: function (make) {
                    make.top.equalTo(15)
                    make.height.equalTo(35)
                    make.left.right.inset(20)
                },
                events: {
                    returned: function (sender) {
                        var _text = sender.text
                        matView.insert({
                            index: 0,
                            value: {
                                loc_title: {
                                    text: _text
                                }
                            }
                        })
                        $cache.set("key", [{
                            loc_title: {
                                text: _text
                            }
                        }, {
                            loc_title: {
                                text: "定位"
                            }
                        }])
                        $ui.pop()
                        $ui.animate({
                            duration: 0.3,
                            animation: function () {
                                $("scroll").alpha = 0
                            }
                        })
                        $ui.toast("查询中...", 3)
                        getLocWeather(sender.text)
                    }
                }
            },
            {
                type: "label",
                props: {
                    text: "热门城市",
                    textColor: $color("gray"),
                },
                layout: function (make) {
                    make.top.equalTo($("loc_input").bottom).offset(10)
                    make.left.equalTo(25)
                }
            },
            {
                type: "view",
                props: {
                },
                layout: function (make, view) {
                    make.top.equalTo($("loc_input").bottom).offset(40)
                    make.center.equalTo(view.super)
                    make.size.equalTo($size(view.super.frame.width - 20, 400))
                },
                views: [{
                    type: "matrix",
                    props: {
                        columns: 3,
                        itemHeight: 40,
                        spacing: 25,
                        template: {
                            views: [{
                                type: "label",
                                props: {
                                    id: "loc_title",
                                    radius: 15,
                                    bgcolor: $color("tint"),
                                    textColor: $color("white"),
                                    align: $align.center,
                                    font: $font(20),
                                },
                                layout: $layout.fill
                            }]
                        },
                    },
                    layout: $layout.fill,
                    events: {
                        didSelect: function (sender, indexPath, data) {
                            if (indexPath.row == 1) {
                                $ui.pop()
                                $ui.animate({
                                    duration: 0.3,
                                    animation: function () {
                                        $("scroll").alpha = 0
                                    }
                                })
                                $ui.toast("查询当地天气...", 2)
                                getLocation()
                            } else if (indexPath.row == 0) {
                                $ui.pop()
                                $ui.animate({
                                    duration: 0.3,
                                    animation: function () {
                                        $("scroll").alpha = 0
                                    }
                                })
                                $ui.toast("查询中...", 2)
                                getLocWeather(data.loc_title.text)
                            }
                        }
                    }
                }]
            },
        ]
    })
    var matView = $("matrix")
    var locData = $cache.get("key") || []
    matView.data = locData
}

// 实景图展示
function showPhoto() {
    $ui.push({
        props: {
            title: "实景图"
        },
        views: [{
            type: "gallery",
            props: {
                id: "photoList",
                interval: 2,
                radius: 8,
                items: [{
                        type: "image",
                        props: {
                            src: photoUrl[0].split("?")[0]
                        }
                    },
                    {
                        type: "image",
                        props: {
                            src: photoUrl[1].split("?")[0]
                        }
                    },
                    {
                        type: "image",
                        props: {
                            src: photoUrl[2].split("?")[0]
                        }
                    },
                    {
                        type: "image",
                        props: {
                            src: photoUrl[3].split("?")[0]
                        }
                    },
                    {
                        type: "image",
                        props: {
                            src: photoUrl[4].split("?")[0]
                        }
                    }
                ]
            },
            layout: function (make, view) {
                make.left.top.right.bottom.inset(10)
            }
        }]
    })
}

// 抓取天气所在地实景图
function getPhoto(locationTitle) {
    var timestamp = Date.parse(new Date());
    var urlId = "https://ssch.api.moji.com/json/weather/city/search";
    var urlPhoto = "https://sns.api.moji.com/forum/city/json/get_nearby_flow";
    $http.request({
        method: "POST",
        url: urlId,
        header: {
            "User-Agent": "Workflow/508 CFNetwork/897.15 Darwin/17.5.0"
        },
        body: {
            "common": {
                "mnc": "11",
                "language": "CN",
                "app_version": "50070302",
                "idfa_open": "1",
                "unix": timestamp + ".123",
                "mcc": "460",
                "package_name": "com.moji.MojiWeather",
                "net": "wifi",
                "identifier": "9FAA504C-F97B-4BCD-913A-C520497D948D",
                "platform": "andriod",
                "token": "<780a73e4 0bf070e5 5e33220c f06754b7 4116fbe7 bb6a76f4 628163b1 48690daa>",
                "uid": 704437814,
                "idfv": "5S48B74E-6699-467E-BF05-0FFD863E3E9F",
                "height": 1334,
                "versionType": "1",
                "locationcity": "0",
                "width": 750,
                "os_version": "10.3.2",
                "vip": "1",
                "pid": "9000",
                "device": "iPhone6,2"
            },
            "params": {
                "search_word": locationTitle
            }
        },
        handler: function (resp) {
            var data = resp.data
            cityList = data["city_list"]
            localPname = data["city_list"][0]["localPname"]
            localName = data["city_list"][0]["localName"]
            __id = data["city_list"][0]["id"]
            $http.request({
                method: "POST",
                url: urlPhoto,
                header: {
                    "User-Agent": "Workflow/508 CFNetwork/897.15 Darwin/17.5.0"
                },
                body: {
                    "common": {
                        "mnc": "11",
                        "language": "CN",
                        "app_version": "50070209",
                        "idfa_open": "1",
                        "unix": "." + timestamp + ".801",
                        "mcc": "460",
                        "package_name": "com.moji.MojiWeather",
                        "net": "wifi",
                        "identifier": "9FAA504C-F97B-4BCD-913A-C520497D948D",
                        "platform": "andriod",
                        "token": "<780a73e4 0bf070e5 5e33220c f06754b7 4116fbe7 bb6a76f4 628163b1 48690daa>",
                        "uid": 704437814,
                        "idfv": "5D44B74E-7799-467E-BF05-0FFD863E3E9F",
                        "height": 1334,
                        "versionType": "1",
                        "locationcity": "0",
                        "width": 750,
                        "os_version": "10.3.3",
                        "vip": "1",
                        "pid": "9000",
                        "device": "iPhone6,2"
                    },
                    "params": {
                        "type": 0,
                        "page_length": 5,
                        "latitude": 0,
                        "longitude": 0,
                        "city_id": __id,
                        "page_past": 0
                    }
                },
                handler: function (resp) {
                    var data = resp.data
                    pList = data["picture_list"]
                    for (var i in pList) {
                        photoUrl.unshift(pList[i]["path"])
                    }
                }
            })
        }
    })
}

// 设置界面
function weatherSettings() {
    $ui.push({
        props: {
            title: "设定"
        },
        views: [{
            type: "list",
            props: {
                data: [{
                        title: "主题",
                        rows: ["跟随JSBox", "自定义", "随机"]
                    },
                    {
                        title: "其他",
                        rows: ["清理缓存"]
                    },
                    {
                        title: "版本号 " + __version,
                        rows: ["检查更新"]
                    }
                ]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (sender, indexPath, data) {
                    if (data == "跟随JSBox") {
                        $cache.set("scrollColor", {
                            color: $color("tint")
                        })
                        updateColorAlert()
                    } else if (data == "自定义") {
                        $input.text({
                            type: $kbType.ascii,
                            placeholder: "输入十六进制颜色代码",
                            handler: function (text) {
                                $cache.set("scrollColor", {
                                    color: $color(text)
                                })
                                updateColorAlert()
                            }
                        })
                    } else if (data == "随机") {
                        c = getRandomColor()
                        $cache.set("scrollColor", {
                            color: $color(c)
                        })
                        updateColorAlert()
                    } else if (data == "清理缓存") {
                        $cache.remove("scrollColor")
                        $ui.toast("已清除", 2)
                    } else if (data == "检查更新") {
                        $ui.loading(true)
                        $http.get({
                            url: "https://raw.githubusercontent.com/alpha87/JsBoxScript/master/Weather/version.json",
                            handler: function (resp) {
                                var data = resp.data
                                oldVersion = data['version']
                                infors = data['informations']
                                if (oldVersion !== __version) {
                                    $device.taptic(0)
                                    $ui.alert({
                                        title: "有新版本",
                                        message: infors.length > 12 ? infors.slice(0, 12) + "..." : infors,
                                        actions: [{
                                                title: "立即更新",
                                                handler: function (sender) {
                                                    $safari.open({
                                                        url: "https://jsboxbbs.com/"
                                                    })
                                                },
                                            },
                                            {
                                                title: "暂不更新"
                                            }
                                        ]
                                    })
                                } else {
                                    $ui.alert({
                                        title: "暂无更新",
                                        actions: [{
                                            title: "好的",
                                            handler: function () {
                                                $ui.loading(false)
                                            }
                                        }]
                                    })
                                }
                            }
                        })
                    }
                }
            }
        }]
    })
}

// 更新主题色alert
function updateColorAlert() {
    $ui.pop()
    $ui.alert({
        message: "更新主题色",
        actions: [{
                title: "手动重启",
                handler: function (sender) {
                    $app.close()
                }
            },
            {
                title: "暂不重启"
            }
        ]
    })
}

// 随机生成十六进制颜色
function getRandomColor() {
    var colorElements = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
    var colorArray = colorElements.split(",");
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += colorArray[Math.floor(Math.random() * 16)];
    }
    return color;
}

module.exports = {
    main: getLocation
}