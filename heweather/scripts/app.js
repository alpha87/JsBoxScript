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
        url: "https://free-api.heweather.com/s6/weather?location=" + lng + "," + lat + "&key=c6f839cb9c8a4581aed0900da94e7df6",
        handler: function (resp) {
            var data = resp.data
            if (data.HeWeather6[0].status == "ok") {
                showData(data)
            } else {
                $ui.alert({
                    title: "ERROR",
                    message: "请求失败!",
                })
            }
        }
    })
}

function showData(wea) {

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

    $ui.toast("更新时间: " +  update_date)
    $ui.render({
        props: {
            title: "和风天气"
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
                }
            },
            {
                type: "label",
                props: {
                    id: "date",
                    font: $font("bold", 20),
                    text: update_date.slice(0, 10),
                },
                layout: function (make, view) {
                    make.top.equalTo($("local"))
                    make.right.equalTo(-40)
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
                    id: "tomo_date",
                    font: $font("bold", 20),
                    text: tomorrow_wea.date.slice(5),
                },
                layout: function (make, view) {
                    make.left.equalTo(30)
                    make.centerY.equalTo($("tmp_m")).offset(300)
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
                    make.right.equalTo(-20)
                    make.centerY.equalTo($("tomo_date"))
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
                    id: "tomo_cond",
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
                    make.right.equalTo(-20)
                    make.centerY.equalTo($("oth_date"))
                }
            }
        ]
    })
}

module.exports = {
    init: getLocation
}