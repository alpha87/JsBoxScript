// 获取快递公司名称
function getComCode(order) {
  $http.get({
    url: "http://m.kuaidi100.com/autonumber/auto?num=" + order,
    handler: function (resp) {
      var data = resp.data;
      var comCode = resp.data[0].comCode;
      getMessage(comCode, order);
    }
  });
}

// 查询快递状态
function getMessage(comCode, order) {
  $http.get({
    url: "https://m.kuaidi100.com/query?type=" + comCode + "&postid=" + order,
    handler: function (resp) {
      var data = resp.data;
      console.log(data)
      if (data.status != "200") {
        $ui.alert({
          title: "查询失败",
          message: data.message,
        })
      } else if (data.status == "200") {
        $("mainList").data = data.data.map(function (item) {
          return convert(item);
        });
      }
    }
  })
}

// 将获取到的信息格式化
function convert(item) {
  return {
    "dateLabel": {
      text: item.time
    },
    "context": {
      text: item.context
    }
  }
}

function main(order) {
  getComCode(order);
  // 快递详情模板
  var temList = {
    views: [{
      type: "label",
      props: {
        id: "dateLabel",
        font: $font("bold", 16),
      },
      layout: function (make) {
        make.top.equalTo(5);
        make.left.right.inset(15);
      },
    },
    {
      type: "label",
      props: {
        id: "context",
        font: $font(14),
        lines: 3,
        textColor: $color("#888888")
      },
      layout: function (make, view) {
        make.left.right.equalTo($("dateLabel"));
        make.top.equalTo($("dateLabel").bottom).offset(2);
      },
    },
    ]
  };

  $ui.render({
    props: {
      title: "查询结果"
    },
    views: [{
      type: "list",
      props: {
        id: "mainList",
        rowHeight: 65,
        template: temList,
        showsVerticalIndicator: false,
      },
      layout: $layout.fill,
      events: {
        didSelect: function (sender, indexPath, context) {
          $ui.alert({
            title: "详细信息",
            message: context.context.text,
          });
        }
      }
    }]
  });
}

$input.text({
  type: $kbType.namePhone,
  placeholder: "输入快递单号",
  text: $cache.get("_order") !== undefined ? $cache.get("_order") : $clipboard.text,
  handler: function (text) {
    $cache.set("_order", text.trim())
    $ui.loading(true);
    main(text.trim());
  }
});