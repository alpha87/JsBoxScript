// 快递详情模板
var tem_list = {
  views: [{
      type: "label",
      props: {
        id: "time",
        font: $font(20),
      },
      layout: function(make, view) {
        make.left.right.inset(18)
        make.top.equalTo(3)
      },
    },
    {
      type: "label",
      props: {
        id: "location",
        font: $font("bold", 16),
      },
      layout: function(make, view) {
        make.left.right.equalTo($("time"))
        make.top.equalTo($("time")).inset(22)
      },
    },
    {
      type: "label",
      props: {
        id: "context",
        font: $font(16),
        textColor: $color("#888888")
      },
      layout: function(make, view) {
        make.left.right.equalTo($("time"))
        make.top.equalTo($("location").bottom)
        make.bottom.equalTo(-5)
      },
    },
  ]
}

quick()

$ui.render({
  props: {
    id: "label",
    title: "快递100 速查"
  },
  views: [{
      type: "input",
      props: {
        id: "input-bar",
        type: $kbType.number,
        placeholder: "这里输入订单号"
      },
      layout: function(make, view) {
        make.height.equalTo(40)
        make.left.equalTo(15)
        make.top.equalTo(10)
        make.left.right.top.inset(80)
      }
    },
    {
      type: "button",
      props: {
        title: "查 询"
      },
      layout: function(make, view) {
        make.top.equalTo(10)
        make.height.equalTo(40)
        make.width.equalTo(60)
        make.right.equalTo($("input-bar").right).offset(70)
      },
      events: {
        tapped: function() {
          $("input-bar").blur() // input 标签失去焦点后自动收起键盘
          $("footer-bar").text = ""
          $("main-list").data = []
          $ui.toast("查询中...")
          $ui.loading(true)
          var text = $clipboard.text
          if (isNaN(text)) {
            if (!$("input-bar").text) {
              $ui.loading(false)
              $ui.alert({
                message: "请输入订单号",
              })
            }
            let _order = Trim($("input-bar").text) // 获取 input 标签输入的内容
            if (isOrder(_order)) {
              get_com(_order)
            }
          } else {
            if ($("input-bar").text) {
              let _order = Trim($("input-bar").text)
              get_com(_order)
            } else {
              get_com(text)
            }
          }
        }
      }
    },
    {
      type: "list",
      props: {
        id: "main-list",
        rowHeight: 85,
        template: tem_list,
        footer: {
          type: "label",
          props: {
            id: "footer-bar",
            height: 20,
            textColor: $color("#AAAAAA"),
            align: $align.center,
            font: $font(12)
          }
        }
      },
      layout: function(make, view) {
        make.left.right.bottom.inset(10)
        make.top.equalTo($("input-bar").bottom).offset(10)
      }
    }
  ]
})

// 查询快递状态
function get_message(comCode, order) {
  $http.get({
    url: "https://m.kuaidi100.com/query?type=" + comCode + "&postid=" + order,
    handler: function(resp) {
      var data = resp.data
      $ui.loading(false)
      if (data["status"] != "200") {
        $ui.alert({
          title: "查询失败",
          message: data["message"],
        })
      } else if (data["status"] == "200") {
        $("footer-bar").text = "- 我也是有底线的 -"
        $("main-list").data = data["data"].map(function(item) {
          return convert(item)
        })
      }
    }
  })
}

// 获取快遞公司名称
function get_com(order) {
  $http.get({
    method: "GET",
    url: "http://m.kuaidi100.com/autonumber/auto?num=" + order,
    handler: function(resp) {
      var data = resp.data
      var comCode = resp.data[0]["comCode"]
      get_message(comCode, order)
    },
  })
}

// 去前后空格
function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 判断是否为订单号
function isOrder(order) {
  if (isNaN(order)) {
    $ui.alert({
      message: "请输入正确的运单号!",
    })
    $ui.loading(false)
    return false
  } else {
    return order
  }
}

// 将获取到的信息格式化
function convert(item) {
  return {
    "time": {
      text: item["time"]
    },
    "location": {
      text: item["location"]
    },
    "context": {
      text: item["context"]
    }
  }
}

// 直接查询
function quick() {
  $ui.loading(true)
  
  var text = $clipboard.text
  if (!isNaN(text)) {
    get_com(text)
    $ui.toast("查询中...")
  }
}
