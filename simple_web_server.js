$http.startServer({
  port: 8714,
  path: "",
  handler: function (result) {
    var url = result.url !== "" ? result.url : "请在Wi-Fi下使用"
    $ui.menu({
      items: [url],
      handler: function () {
        $http.stopServer()
      },
      finished: function (cancelled) {
        if (cancelled === true) {
          $http.stopServer()
        }
      }
    })
  }
})
