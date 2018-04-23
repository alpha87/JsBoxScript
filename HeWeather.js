// 获取当地经纬度
function getLocation() {
    $location.fetch({
        handler: function (resp) {
            var lat = resp.lat
            var lng = resp.lat
            getWeather(lat, lng)

        }
    })
}

// 获取和风天气API数据
function getWeather(lat, lng) {
    $http.get({
        url: "https://free-api.heweather.com/s6/weather?location=202.97.139.31&key=c6f839cb9c8a4581aed0900da94e7df6",
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
    $console.info(wea)
}

getLocation()