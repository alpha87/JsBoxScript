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
            $console.info(data)
            if (data.HeWeather6[0].status == "ok") {
                if ($app.env == $env.today) {
                    showToday(data)
                } else {
                    showData(lat, lng, data)
                }
            } else {
                $ui.toast(data.HeWeather6[0].status.toUpperCase())
            }
        }
    })
}

function showToday(wea) {

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

    $ui.render({
        props: {
            title: ""
        },
        views: [{
                type: "image",
                props: {
                    id: "image",
                    src: 'assets/' + cond_code + '.png',
                    bgcolor: $rgba(100, 100, 100, 0),
                },
                layout: function (make, view) {
                    make.top.equalTo()
                    make.left.equalTo(30)
                }
            },
            {
                type: "label",
                props: {
                    id: "tmp",
                    font: $font("bold", 50),
                    text: tmp + "℃",
                },
                layout: function (make, view) {
                    make.top.equalTo(5)
                    make.right.equalTo(-130)
                }
            },
            {
                type: "label",
                props: {
                    id: "tmp_m",
                    font: $font("bold", 17),
                    text: today_wea.tmp_min + "°" + " ~ " + today_wea.tmp_max + "°",
                },
                layout: function (make, view) {
                    make.top.equalTo($("tmp").bottom).offset(5)
                    make.right.equalTo($("tmp").right)
                }
            },
            {
                type: "label",
                props: {
                    id: "wind",
                    font: $font("bold", 17),
                    text: "🌬" + wind_dir,
                },
                layout: function (make, view) {
                    make.top.equalTo($("tmp")).offset(20)
                    make.right.equalTo(-30)
                }
            },
            {
                type: "label",
                props: {
                    id: "rain",
                    font: $font("bold", 17),
                    text: "💦 " + today_wea["pop"] + "%",
                },
                layout: function (make, view) {
                    make.top.equalTo($("wind").bottom).offset(20)
                    make.right.equalTo($("wind"))
                }
            }
        ]
    })
}

function showData(lat, lng, wea) {
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

    $ui.render({
        props: {
            title: "和风天气",
        },
        views: [{
            type: "scroll",
            props: {
                alwaysBounceHorizontal: false,
            },
            layout: $layout.fill,
            events: {
                pulled: function (params) {
                    getLocation()
                    $("scroll").endRefreshing()
                    $ui.toast("已刷新", 0.5)
                }
            },
            views: [{
                    type: "label",
                    props: {
                        id: "local",
                        font: $font("bold", 20),
                        text: parent_city + location,
                    },
                    layout: function (make, view) {
                        make.top.equalTo(20)
                        make.left.equalTo(50)
                    },
                    events: {
                        tapped: function (sender) {
                            $ui.push({
                                props: {
                                    title: "地图"
                                },
                                views: [{
                                    type: "map",
                                    props: {
                                        location: {
                                            lat: lat,
                                            lng: lng
                                        }
                                    },
                                    layout: $layout.fill
                                }]
                            })
                        }
                    }
                },
                {
                    type: "label",
                    props: {
                        id: "date",
                        font: $font("bold", 20),
                        text: today_wea.date.slice(0, 10),
                    },
                    layout: function (make, view) {
                        make.top.equalTo($("local"))
                        make.centerX.equalTo(110)
                    }
                },
                {
                    type: "image",
                    props: {
                        id: "image",
                        src: 'assets/' + cond_code + '.png',
                        bgcolor: $rgba(100, 100, 100, 0),
                    },
                    layout: function (make, view) {
                        make.centerX.equalTo(-100)
                        make.centerY.equalTo(-200)
                    }
                },
                {
                    type: "label",
                    props: {
                        id: "tmp",
                        font: $font("bold", 75),
                        text: tmp + "℃",
                    },
                    layout: function (make, view) {
                        make.centerX.equalTo(50)
                        make.centerY.equalTo(-200)
                    }
                },
                {
                    type: "label",
                    props: {
                        id: "wind",
                        font: $font("bold", 17),
                        text: "🌬" + wind_dir + "  " + wind_sc + "mph / 💦 " + today_wea["pop"] + "%",
                    },
                    layout: function (make, view) {
                        make.centerX.equalTo(0)
                        make.centerY.equalTo($("tmp")).offset(80)
                    }
                },
                {
                    type: "label",
                    props: {
                        id: "tmp_m",
                        font: $font("bold", 17),
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
                        font: $font(18),
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
                        font: $font(18),
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
                        font: $font(18),
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
                        font: $font(18),
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
                        font: $font(18),
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
                        font: $font(18),
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
                        make.left.equalTo(30)
                        make.centerY.equalTo($("tmp_m")).offset(305)
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
                        make.right.equalTo($("tomo_date").right).offset(110)
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
                        font: $font("bold", 17),
                        text: tomorrow_wea.tmp_min + "°" + " ~ " + tomorrow_wea.tmp_max + "°",
                    },
                    layout: function (make, view) {
                        make.top.equalTo($("tomo_cond"))
                        make.right.equalTo($("date"))
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
                        make.left.equalTo(30)
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
                        make.right.equalTo($("oth_date").right).offset(110)
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
                        font: $font("bold", 17),
                        text: other_wea.tmp_min + "°" + " ~ " + other_wea.tmp_max + "°",
                    },
                    layout: function (make, view) {
                        make.top.equalTo($("oth_cond"))
                        make.right.equalTo($("date"))
                    }
                },

            ]
        }]
    })
}

module.exports = {
    main: getLocation
}