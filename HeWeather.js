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
                showData(data)
            } else {
                $ui.alert({
                    title: "错误",
                    message: "请求失败!",
                })
            }
        }
    })
}

// 展示数据
function showData(wea) {
    var _basic = wea.HeWeather6[0].basic
    var cnty = _basic.cnty
    var area = _basic.admin_area ? _basic.admin_area != undefined : ""
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

    var m = wea_tmp
    m._date = tomorrow["date"]
    m.sr = tomorrow.sr
    m.ss = tomorrow.ss
    m.mr = tomorrow.mr
    m.ms = tomorrow.ms
    m.tmp_max = tomorrow.tmp_max
    m.tmp_min = tomorrow.tmp_min
    m.cond_txt_d = tomorrow.cond_txt_d
    m.cond_txt_n = tomorrow.cond_txt_n
    m.wind_dir = tomorrow.wind_dir
    m.wind_sc = tomorrow.wind_sc
    m.hum = tomorrow.hum
    m.pcpn = tomorrow.pcpn
    m._pop = tomorrow["pop"]
    m.uv_index = tomorrow.uv_index

    var data_text = ["# 天气预报 (*无敌省流量*)", "位置:" + cnty + " " + area + " " + location, "经度:" + lng, "纬度:" + lat].join("\n")
    var update_text = "天气更新时间: **" + update_date + "**\n"
    var now_text = ["## 实况", "体感温度:" + "**" + fl + "**", "温度:" + "**" + tmp + "**", "天气状况:" + "**" + cond_text + "**", "风向:" + wind_dir,
        "风力:" + wind_sc, "风速:" + wind_spd, "相对湿度:" + hum, "降水量:" + pcpn, "云量:" + cloud + "\n"].join("\n")
    var daily_text_d = ["## 天气预报", "预报日期:" + t._date, "日出时间:" + t.sr, "日落时间:" + t.ss, "月升时间:" + t.mr, "月落时间:" + t.ms,
        "最高温度:" + "**" + t.tmp_max + "**", "最低温度:" + "**" + t.tmp_min + "**", "白天天气状况:" + t.cond_txt_d, "夜晚天气状况:" + t.cond_txt_n, "风向:" + t.wind_dir,
        "风力:" + t.wind_sc, "相对温度:" + t.hum, "降水量:" + t.pcpn, "降水概率:" + "**" + t._pop + "**", "紫外线强度指数:" + t.uv_index].join("\n")
    var daily_text_t = [" ", "预报日期:" + m._date, "日出时间:" + m.sr, "日落时间:" + m.ss, "月升时间:" + m.mr, "月落时间:" + m.ms,
        "最高温度:" + m.tmp_max, "最低温度:" + m.tmp_min, "白天天气状况:" + m.cond_txt_d, "夜晚天气状况:" + m.cond_txt_n, "风向:" + m.wind_dir,
        "风力:" + m.wind_sc, "相对温度:" + m.hum, "降水量:" + m.pcpn, "降水概率:" + m._pop, "紫外线强度指数:" + m.uv_index].join("\n")
    $ui.render({
        props: {
            title: ""
        },
        views: [{
            type: "markdown",
            props: {
                font: $font(20),
                content: [data_text, update_text, now_text, daily_text_d, daily_text_t].join("\n"),
            },
            layout: $layout.fill,
        }]
    })
}

getLocation()