// 版本号
var __version = "v1.2.5";

// 存放实景图链接
var photoUrl = []

// appKey & 检查更新
appKey = $cache.get("appKey") == undefined ? "8fbe6ffd3b024bfba065104eaec87196" : $cache.get("appKey")
$cache.get("autoUpdateSwitch") == undefined ? autoUpdate() : ($cache.get("autoUpdateSwitch") ? autoUpdate() : null)

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
        url: "https://free-api.heweather.com/s6/weather?location=" + lng + "," + lat + "&key=" + appKey,
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
        url: "https://free-api.heweather.com/s6/weather?location=" + encodeURI(text) + "&key=" + appKey,
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
    var __width = $device.info["screen"]["width"] - 50
    var __height = $device.info['screen']["height"] - 160

    // 接口基本数据
    var _basic = wea.HeWeather6[0].basic, parent_city = _basic.parent_city
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
                type: "label",
                props: {
                    id: "local",
                    font: $font("bold", 16),
                    text: parent_city !== location ? parent_city + location : parent_city,
                },
                layout: function (make, view) {
                    make.top.equalTo(15)
                    make.left.equalTo(50)
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
                    icon: $icon("129", $color("#DDDDDD"), $size(22, 22)),
                    bgcolor: $color("clear"),
                },
                layout: function (make, view) {
                    make.right.inset(80)
                    make.bottom.inset(10)
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
                    icon: $icon("030", $color("#DDDDDD"), $size(22, 22)),
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
                type: "button",
                props: {
                    id: "tts",
                    icon: $icon("049", $color("#DDDDDD"), $size(22, 22)),
                    bgcolor: $color("clear"),
                },
                layout: function (make, view) {
                    make.top.equalTo($("settings"))
                    make.left.inset(30)
                },
                events: {
                    tapped: function (sender) {
                        $ui.alert({
                            title: "TTS",
                            message: "敬请期待",
                        });
                    }
                }
            },
            {
                type: "scroll",
                props: {
                    radius: 18,
                    bgcolor: $cache.get("scrollColor") == undefined ? $color("clear") : $cache.get("scrollColor").color,
                    showsVerticalIndicator: false,
                    alwaysBounceHorizontal: false,
                },
                layout: function (make, view) {
                    make.top.equalTo($("local").bottom).offset(15)
                    make.size.equalTo($size(__width, __height))
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
                    },
                    events: {
                        tapped: function (sender) {
                            hourly(wea)
                        }
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
                        var num = ''
                        tomorrow_wea.cond_txt_d.length < 3 ? num = 40 : num = 60
                        make.right.equalTo($("tomo_image").right).offset(num)
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
                        var num = ''
                        other_wea.cond_txt_d.length < 3 ? num = 40 : num = 60
                        make.right.equalTo($("oth_image").right).offset(num)
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
function newWeather() {
    var __width = $device.info["screen"]["width"] - 50
    $ui.push({
        props: {
            title: "搜索"
        },
        views: [{
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
                    cityList.unshift(_text)
                    historyListView.insert({
                        index: 0,
                        value: _text,
                    })
                    $cache.set("cityList", cityList)
                    _show()
                    $ui.toast("查询中...", 3)
                    getLocWeather(sender.text)
                }
            }
        },
        {
            type: "label",
            props: {
                id: "label_city",
                text: "热门城市",
                textColor: $color("gray"),
            },
            layout: function (make) {
                make.top.equalTo($("loc_input").bottom).offset(20)
                make.left.equalTo(25)
            }
        },
        {

            type: "matrix",
            props: {
                columns: 3,
                spacing: 26,
                itemHeight: 40,
                scrollEnabled: false,
                data: [{
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
                },],
                template: {
                    views: [{
                        type: "label",
                        props: {
                            id: "loc_title",
                            radius: 15,
                            bgcolor: $cache.get("scrollColor") == undefined ? $color("#F5FFFA") : $cache.get("scrollColor").color,
                            textColor: $color("tint"),
                            align: $align.center,
                            font: $font(20),
                        },
                        layout: $layout.fill
                    }]
                },
            },
            layout: function (make, view) {
                make.top.equalTo(90)
                make.left.equalTo(5)
                make.right.equalTo(-5)
                make.size.equalTo($size(__width, 210))
            },
            events: {
                didSelect: function (sender, indexPath, data) {
                    if (indexPath.row == 0) {
                        _show()
                        getLocation()
                    } else {
                        _show()
                        getLocWeather(data.loc_title.text)
                    }
                }
            }
        },
        {
            type: "label",
            props: {
                id: "history_city",
                text: "历史记录",
                textColor: $color("gray"),
                hidden: $cache.get("cityList") == undefined ? true : false
            },
            layout: function (make, view) {
                make.top.equalTo($("matrix").bottom).offset(10)
                make.left.equalTo($("label_city"))
            }
        },
        {
            type: "button",
            props: {
                id: "cleanHistory",
                icon: $icon("027", $color("#ADD8E6"), $size(22, 22)),
                bgcolor: $color("clear"),
                hidden: $cache.get("cityList") == undefined ? true : false
            },
            layout: function (make, view) {
                make.top.equalTo($("matrix").bottom).offset(10)
                make.right.inset(25)
            },
            events: {
                tapped: function (sender) {
                    $ui.alert({
                        title: "清空全部记录",
                        actions: [{
                            title: "清除",
                            handler: function () {
                                historyListView.data = []
                                $("history_city").hidden = true
                                $("cleanHistory").hidden = true
                                $cache.remove("cityList")
                            }
                        }, {
                            title: "取消"
                        }]
                    })
                }
            }
        },
        {
            type: "view",
            props: {},
            layout: function (make, view) {
                make.left.equalTo(15)
                make.right.equalTo(-15)
                make.top.equalTo($("matrix").bottom).offset(40)
                make.size.equalTo($size(__width, 300))
            },
            views: [{
                type: "list",
                props: {
                    id: "history_list",
                    actions: [{
                        title: "delete",
                        handler: function (sender, indexPath) {
                            var cityName = cityList[indexPath.row]
                            var index = cityList.indexOf(cityName)
                            if (index >= 0) {
                                cityList.splice(index, 1)
                                $cache.set("cityList", cityList)
                            }
                        }
                    }]
                },
                layout: $layout.fill,
                events: {
                    didSelect: function (sender, indexPath, cacheCity) {
                        _show()
                        getLocWeather(cacheCity)
                    }
                }
            }]
        }
        ]
    })

    var historyListView = $("history_list")
    var cityList = $cache.get("cityList") || []
    historyListView.data = cityList
}

// 实景图展示
function showPhoto() {
    var photoUrl = $cache.get("photoUrl")
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
            },
            events: {
                tapped: function () {
                    $ui.menu({
                        items: ["查看更多"],
                        handler: function (title, idx) {
                            if (idx == 0) {
                                showMorePhoto()
                            }
                        }
                    })
                }
            }
        }]
    })
}

// 查看更多实景图
function showMorePhoto() {
    $ui.push({
        props: {
            title: "More"
        },
        views: [{
            type: "spinner",
            props: {
                loading: true
            },
            layout: function (make, view) {
                make.center.equalTo(view.super)
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
                        $cache.set("photoUrl", photoUrl)
                    }
                }
            })
        }
    })
}

// 设置界面
function weatherSettings() {
    const versionUITemp = {
        type: "view",
        props: {},
        views: [{
            type: "label",
            props: {
                id: "autoUpdateLabel",
                text: "检查更新"
            },
            layout: function (make, view) {
                make.center.equalTo()
                make.left.equalTo(15)
            }
        },
        {
            type: "switch",
            props: {
                on: $cache.get("autoUpdateSwitch") == undefined ? true : $cache.get("autoUpdateSwitch")
            },
            layout: function (make, view) {
                make.top.equalTo(7)
                make.right.equalTo($("autoUpdateLabel"))
            },
            events: {
                changed: function (sender) {
                    $cache.set("autoUpdateSwitch", sender.on)
                }
            }
        }
        ],
        layout: $layout.fill
    }

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
                    rows: ["使用介绍", "清理缓存"]
                },
                {
                    title: "版本号 " + __version,
                    rows: ["更新appKey", versionUITemp]
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
                        $ui.menu({
                            items: ["清理主题缓存", "清理图片缓存"],
                            handler: function (title, idx) {
                                if (idx == 0) {
                                    $cache.remove("scrollColor")
                                    $ui.toast("已清理", 1)
                                } else if (idx == 1) {
                                    $cache.remove("photoUrl")
                                    $ui.toast("已清理", 1)
                                }
                            }
                        })
                    } else if (data == "使用介绍") {
                        $ui.toast("加载中", 1)
                        showHelp()
                    } else if (data == "更新appKey") {
                        changeKey()
                    } else if (data.views[0].props.text == "检查更新") {
                        sender.cell(indexPath).startLoading()
                        $http.get({
                            url: "https://raw.githubusercontent.com/alpha87/JsBoxScript/master/Weather/version.json",
                            handler: function (resp) {
                                var data = resp.data
                                oldVersion = data['version']
                                infors = data['informations']
                                if (oldVersion !== __version) {
                                    sender.cell(indexPath).stopLoading()
                                    $device.taptic(0)
                                    $ui.alert({
                                        title: "有新版本",
                                        message: infors,
                                        actions: [{
                                            title: "立即更新",
                                            handler: function (sender) {
                                                $safari.open({
                                                    url: "https://xteko.com/redir?name=Weather&icon=046&url=https://github.com/alpha87/JsBoxScript/raw/master/Weather/.output/Weather.box"
                                                })
                                            },
                                        },
                                        {
                                            title: "暂不更新",
                                            handler: function (sender) { },
                                        }
                                        ]
                                    })
                                } else {
                                    sender.cell(indexPath).stopLoading();
                                    $ui.alert({
                                        title: "暂无更新",
                                        actions: [{
                                            title: "好的",
                                            handler: function () {

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

// 展示使用须知
function showHelp() {
    $ui.loading(true)
    $http.get({
        url: "https://raw.githubusercontent.com/alpha87/JsBoxScript/master/Weather/README.md",
        handler: function (resp) {
            $ui.loading(false)
            var data = resp.data
            $ui.push({
                props: {
                    title: "使用介绍"
                },
                views: [{
                    type: "markdown",
                    props: {
                        content: data
                    },
                    layout: $layout.fill
                }]
            })
        }
    })
}

// 更换AppKey
function changeKey() {
    $ui.push({
        props: {
            title: "更换Key"
        },
        views: [{
            type: "label",
            props: {
                textColor: $color("gray"),
                text: "使用中：" + appKey
            },
            layout: function (make) {
                make.top.equalTo(10)
                make.left.right.inset(15)
            }
        },
        {
            type: "input",
            props: {
                placeholder: "输入你的key"
            },
            layout: function (make) {
                make.top.equalTo($("label").bottom).offset(10)
                make.left.right.inset(15)
                make.height.equalTo(35)
            }
        },
        {
            type: "button",
            props: {
                title: "确认更换",
                contentEdgeInsets: $insets(5, 5, 5, 5)
            },
            layout: function (make, view) {
                make.top.equalTo($("input").bottom).offset(10)
                make.right.inset(15)
            },
            events: {
                tapped: function (sender) {
                    $("input").blur()
                    $cache.set("appKey", $("input").text)
                    $ui.toast("更新成功")
                    $device.taptic(0)
                }
            }
        },
        ]
    })
}

// 小时天气预报
function hourly(wea) {
    hourlyData = wea.HeWeather6[0].hourly
    const hourlyTemplate = {
        type: "view",
        props: {
        },
        layout: $layout.fill,
        views: []
    }

    $ui.push({
        props: {
            title: "小时预报"
        },
        views: [{
            type: "list",
            props: {
                data: ["JavaScript", "Swift"]
            },
            layout: $layout.fill,
        }]
    })
}

// 动画
function _show() {
    $ui.pop()
    $ui.animate({
        duration: 0.3,
        animation: function () {
            $("scroll").alpha = 0
        }
    })
}

// 主动检查更新
function autoUpdate() {
    $http.get({
        url: "https://raw.githubusercontent.com/alpha87/JsBoxScript/master/Weather/version.json",
        handler: function (resp) {
            var data = resp.data
            oldVersion = data['version']
            infors = data['informations']
            if ((oldVersion !== __version) && (data !== "")) {
                $device.taptic(0)
                $ui.alert({
                    title: "有新版本",
                    message: infors,
                    actions: [{
                        title: "立即更新",
                        handler: function (sender) {
                            $safari.open({
                                url: "https://xteko.com/redir?name=Weather&icon=046&url=https://github.com/alpha87/JsBoxScript/raw/master/Weather/.output/Weather.box"
                            })
                        },
                    },
                    {
                        title: "暂不更新",
                        handler: function (sender) { },
                    }
                    ]
                })
            }
        }
    })
}

// 随机生成十六进制颜色
function getRandomColor() {
    var colorElements = "0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f";
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