main()

function main() {
    $ui.render(
        {
            props: {
                id: "label",
                title: "快递100 速查"
            },
            views: [
                {
                    type: "input",
                    props: {
                        type: $kbType.number,
                        placeholder: "这里输入订单号"
                    },
                    layout: function (make, view) {
                        make.height.equalTo(40)
                        make.left.top.equalTo(15)
                        make.left.right.top.inset(80)
                    }
                },
                {
                    type: "list",
                    props: {
                        id: "orderList",
                        rowHeight: 40,
                        actions: [{
                            title: "delete",
                            handler: function (_, indexPath) {
                                deleteOrder(indexPath)
                            }
                        }]
                    },
                    layout: function (make) {
                        make.left.right.bottom.inset(15)
                        make.top.equalTo($("input").bottom).offset(35)
                    },
                    events: {
                        didSelect: function (_, _, title) {
                            $clipboard.text = title
                            $device.taptic()
                            $ui.toast("已复制")
                            $("input").text = title
                        }
                    },
                },
                {
                    type: "button",
                    props: {
                        title: "查 询"
                    },
                    layout: function (make, view) {
                        make.top.equalTo($("input"))
                        make.height.equalTo($("input"))
                        make.width.equalTo(60)
                        make.right.equalTo($("input").right).offset(70)
                    },
                    events: {
                        tapped: function (sender) {
                            $("input").blur()
                            $("input").text = ""
                            var text = $clipboard.text
                            if (!$("input").text) {
                                $ui.loading(false)
                                $ui.alert({
                                    message: "请输入订单号",
                                })
                            }
                            let _order = Trim($("input").text)
                            if (isOrder(_order)) {
                                $ui.toast("查询中...")
                                newList(_order)
                            }
                            if ($("input").text) {
                                let _order = Trim($("input").text)
                                $ui.toast("查询中...")
                                newList(_order)
                            } else {
                                $ui.toast("查询中...")
                                newList(text)
                            }
                        }
                    },
                },
            ]
        }
    )
}

function newList(order) {

    insertOrder(order)
    get_com(order)
    // 快递详情模板
    var tem_list = {
        views: [{
            type: "label",
            props: {
                id: "time",
                font: $font(20),
            },
            layout: function (make, view) {
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
            layout: function (make, view) {
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
            layout: function (make, view) {
                make.left.right.equalTo($("time"))
                make.top.equalTo($("location").bottom)
                make.bottom.equalTo(-5)
            },
        },
        ]
    }

    $ui.push({
        props: {
            title: "查询结果"
        },
        views: [{
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
            layout: function (make, view) {
                make.left.right.bottom.inset(10)
                make.top.equalTo(10)
            },
            events: {
                didSelect: function (_, _, context) {
                    $ui.alert({
                        title: "详细信息",
                        message: context.context.text,
                    })
                }
            }
        }]
    })
}

var listView = $("orderList")
var orList = $cache.get("orList") || []
var clips = $cache.get("order") || []
listView.data = clips

function insertOrder(text) {
    clips.unshift(text)
    if (!(orList.includes(text))) {
        orList.unshift(text)
        listView.insert({
            index: 0,
            value: text
        })
        saveOrder()
    }
}

function deleteOrder(indexPath) {
    var text = clips[indexPath.row]
    var index = clips.indexOf(text)
    if (index >= 0) {
        clips.splice(index, 1)
        orList.splice(index, 1)
        saveOrder()
    }
}

function saveOrder() {
    $cache.set("order", clips)
    $cache.set("orList", orList)
}

// 获取快遞公司名称
function get_com(order) {
    $http.get({
        method: "GET",
        url: "http://m.kuaidi100.com/autonumber/auto?num=" + order,
        handler: function (resp) {
            var data = resp.data
            var comCode = resp.data[0]["comCode"]
            get_message(comCode, order)
        },
    })
}

// 查询快递状态
function get_message(comCode, order) {
    $http.get({
        url: "https://m.kuaidi100.com/query?type=" + comCode + "&postid=" + order,
        handler: function (resp) {
            var data = resp.data
            $ui.loading(false)
            if (data["status"] != "200") {
                $ui.alert({
                    title: "查询失败",
                    message: data["message"],
                }),
                    $ui.pop()
            } else if (data["status"] == "200") {
                $("footer-bar").text = "- 我也是有底线的 -"
                $("main-list").data = data["data"].map(function (item) {
                    return convert(item)
                })
            }
        }
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