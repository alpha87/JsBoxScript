$app.open()
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
        // 202.97.139.31
        url: "https://free-api.heweather.com/s6/weather?location=" + lng + "," + lat + "&key=c6f839cb9c8a4581aed0900da94e7df6",
        handler: function (resp) {
            var data = resp.data
            if (data.HeWeather6[0].status == "ok") {
                if ($app.env == $env.today) {
                    showToday(data)
                } else {
                    showData(data)
                }
            } else {
                $ui.alert({
                    title: "错误",
                    message: "请求失败!",
                })
            }
        }
    })
}

// today数据展示
function showToday(wea) {
    var _basic = wea.HeWeather6[0].basic
    var cnty = _basic.cnty
    var parent_city = _basic.parent_city
    var area = _basic.admin_area != undefined ? _basic.admin_area : ""
    var location = _basic.location

    var _now = wea.HeWeather6[0]["now"]
    var fl = _now.fl
    var tmp = _now.tmp

    var daily_forecast = wea.HeWeather6[0].daily_forecast
    var today = daily_forecast[0]
    var tmp_max = today.tmp_max
    var tmp_min = today.tmp_min
    var _pop = today["pop"]

    basic_text = "**" + area + parent_city + location + "**"
    tmp_text = "体感温度: " + fl + "\n此刻温度: " + tmp
    other_info = "当天气温: " + tmp_min + "~" + tmp_max + "\n" + "降水概率: " + _pop + "%"
    $ui.render({
        views: [{
            type: "markdown",
            props: {
                content: [basic_text, tmp_text, other_info].join("\n")
            },
            layout: $layout.fill,
        }]
    })

}

// 展示数据
function showData(wea) {
    var _basic = wea.HeWeather6[0].basic
    var cnty = _basic.cnty
    var parent_city = _basic.parent_city
    var area = _basic.admin_area != undefined ? _basic.admin_area : ""
    var location = _basic.location
    var lat = _basic.lat
    var lng = _basic.lon

    var update_date = wea.HeWeather6[0].update.loc

    var _now = wea.HeWeather6[0]["now"]
    var fl = _now.fl
    var tmp = _now.tmp
    var cond_text = _now.cond_txt
    var wind_dir = _now.wind_dir
    var wind_sc = _now.wind_sc
    var wind_spd = _now.wind_spd
    var hum = _now.hum
    var pcpn = _now.pcpn
    var cloud = _now.cloud

    var daily_forecast = wea.HeWeather6[0].daily_forecast
    var today = daily_forecast[0]
    var tomorrow = daily_forecast[1]
    var wea_tmp = {
        _date: "",
        sr: "",
        ss: "",
        mr: "",
        ms: "",
        tmp_max: "",
        tmp_min: "",
        cond_txt_d: "",
        cond_txt_n: "",
        wind_dir: "",
        wind_sc: "",
        hum: "",
        pcpn: "",
        _pop: "",
        uv_index: ""
    }
    var t = wea_tmp
    t._date = today["date"]
    t.sr = today.sr
    t.ss = today.ss
    t.mr = today.mr
    t.ms = today.ms
    t.tmp_max = today.tmp_max
    t.tmp_min = today.tmp_min
    t.cond_txt_d = today.cond_txt_d
    t.cond_txt_n = today.cond_txt_n
    t.wind_dir = today.wind_dir
    t.wind_sc = today.wind_sc
    t.hum = today.hum
    t.pcpn = today.pcpn
    t._pop = today["pop"]
    t.uv_index = today.uv_index

    var data_text = ["# 天气预报 (*无敌省流量*)", "位置:" + cnty + " " + area + " " + parent_city + " " + location, "经度:" + lng, "纬度:" + lat].join("\n")
    var update_text = "天气更新时间: **" + update_date + "**\n"
    var now_text = ["## 实况", "体感温度:" + "**" + fl + "**", "温度:" + "**" + tmp + "**", "天气状况:" + "**" + cond_text + "**", "风向:" + wind_dir,
        "风力:" + wind_sc, "风速:" + wind_spd, "相对湿度:" + hum, "降水量:" + pcpn, "云量:" + cloud + "\n"].join("\n")
    var daily_text_d = ["## 天气预报", "预报日期:" + t._date, "日出时间:" + t.sr, "日落时间:" + t.ss, "月升时间:" + t.mr, "月落时间:" + t.ms,
        "最高温度:" + "**" + t.tmp_max + "**", "最低温度:" + "**" + t.tmp_min + "**", "白天天气状况:" + t.cond_txt_d, "夜晚天气状况:" + t.cond_txt_n, "风向:" + t.wind_dir,
        "风力:" + t.wind_sc, "相对温度:" + t.hum, "降水量:" + t.pcpn, "降水概率:" + "**" + t._pop + "**", "紫外线强度指数:" + t.uv_index].join("\n")
    
        $ui.render({
        props: {
            title: "和风天气"
        },
        views: [{
            type: "markdown",
            props: {
                font: $font(20),
                content: [data_text, update_text, now_text, daily_text_d].join("\n"),
            },
            layout: $layout.fill,
        }]
    })
}

getLocation()