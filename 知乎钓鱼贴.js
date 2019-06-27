const __version = "1.3v";

/**
 * 微信小程序关注：宅宅生活收藏夹
 * 感谢支持！
 */

$app.tips("长按可操作图片")

getNewVersion()

var __width = $device.info["screen"]["width"],
    __height = $device.info['screen']["height"],
    _page = 1;

var popDelegate = null
var search_key = null

var img_list = null

$ui.loading("加载中...")

$ui.render({
    props: {
        id: "list",
        title: "知乎·钓鱼贴",
        navBarHidden: true,
        statusBarStyle: 0,
    },
    views: [{
        type: "view",
        props: {
            id: "mainView",
        },
        layout: $layout.fill,
        views: [{
                type: "image",
                props: {
                    id: "logo",
                    radius: 10,
                    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Zhihu_logo.svg/1280px-Zhihu_logo.svg.png"
                },
                layout: function (make, view) {
                    make.top.equalTo(30)
                    make.left.equalTo(15)
                    make.size.equalTo($size(100, 50))
                }
            },
            {
                type: "label",
                props: {
                    id: "title",
                    text: "钓鱼贴🎣",
                    font: $font("bold", 25),
                    align: $align.center
                },
                layout: function (make, view) {
                    make.left.equalTo($("logo").right).offset(5)
                    make.top.equalTo($("logo")).offset(22)
                }
            },
            {
                type: "button",
                props: {
                    title: "使用微信小程序查看更多最新图片",
                    bgcolor: $rgb(245, 245, 245),
                    radius: 15,
                    titleColor: $rgb(38, 92, 162)
                },
                layout: function (make, view) {
                    make.centerX.equalTo()
                    make.size.equalTo($size(__width - 10, 70))
                    make.top.equalTo($("logo").bottom).offset(10)
                },
                events: {
                    tapped: function (sender) {
                        $ui.push({
                            props: {
                                title: "宅宅生活收藏夹"
                            },
                            views: [{
                                type: "label",
                                props: {
                                    text: "保存小程序码到相册",
                                    align: $align.center
                                },
                                layout: function (make, view) {
                                    make.top.equalTo(40)
                                    make.centerX.equalTo()
                                }
                            }, {
                                type: "label",
                                props: {
                                    text: "或直接在微信中搜索",
                                    align: $align.center
                                },
                                layout: function (make, view) {
                                    make.top.equalTo(70)
                                    make.centerX.equalTo()
                                }
                            }, {
                                type: "label",
                                props: {
                                    text: "宅宅生活收藏夹",
                                    font: $font("bold", 18),
                                    align: $align.center
                                },
                                layout: function (make, view) {
                                    make.top.equalTo(100)
                                    make.centerX.equalTo()
                                }
                            }, {
                                type: "image",
                                props: {
                                    src: "https://user-images.githubusercontent.com/25655581/60225800-f3046000-98ba-11e9-9371-3687987285b6.png"
                                },
                                layout: function (make, view) {
                                    make.center.equalTo(view.super)
                                    make.size.equalTo($size(300, 300))
                                },
                                events: {
                                    tapped: function (sender) {
                                        $http.download({
                                            url: sender.src,
                                            showsProgress: true,
                                            progress: function (bytesWritten, totalBytes) {
                                                var percentage = bytesWritten * 1.0 / totalBytes
                                            },
                                            handler: function (resp) {
                                                $share.sheet(resp.data)
                                            }
                                        })
                                    },
                                    didLongPress: function (sender, indexPath, data) {
                                        $http.download({
                                            url: sender.src,
                                            showsProgress: true,
                                            progress: function (bytesWritten, totalBytes) {
                                                var percentage = bytesWritten * 1.0 / totalBytes
                                            },
                                            handler: function (resp) {
                                                $share.sheet(resp.data)
                                            }
                                        })
                                    },
                                }
                            },{
                                type: "button",
                                props: {
                                  title: " 跳转到微信搜索 "
                                },
                                layout: function(make, view) {
                                    make.top.equalTo(470)
                                    make.centerX.equalTo()
                                },events: {
                                    tapped: function(sender) {
                                        $clipboard.text = "宅宅生活收藏夹"
                                        $ui.toast("已复制");
                                        $app.openURL("weixin://")
                                    }
                                }
                              }]
                        });
                    }
                }
            },
            {
                type: "matrix",
                props: {
                    id: "postList",
                    columns: 1,
                    itemHeight: 80,
                    spacing: 10,
                    showsVerticalIndicator: false,
                    template: {
                        views: [{
                            type: "view",
                            props: {
                                id: "postView",
                                radius: 15,
                                bgcolor: $rgb(245, 245, 245),
                                align: $align.center,
                                font: $font(32)
                            },
                            views: [{
                                    type: "label",
                                    props: {
                                        id: "postTitle",
                                        lines: 2,
                                        font: $font("bold", 18),
                                        textColor: $rgb(38, 92, 162),
                                    },
                                    layout: function (make, view) {
                                        make.left.right.inset(10)
                                        make.top.equalTo(10)
                                    },
                                },
                                {
                                    type: "label",
                                    props: {
                                        id: "imgNum",
                                        lines: 1,
                                        font: $font("bold", 14),
                                        textColor: $rgb(201, 221, 233),
                                    },
                                    layout: function (make, view) {
                                        make.right.inset(10)
                                        make.bottom.equalTo(-10)
                                    },
                                }
                            ],
                            layout: $layout.fill
                        }]
                    }
                },
                layout: function (make) {
                    make.top.equalTo($("logo").bottom).offset(80)
                    make.centerX.equalTo()
                    make.size.equalTo($size(__width, __height))
                },
                events: {
                    didSelect: function (sender, indexPath, data) {
                        getNews(data["img_list"]["array"])
                    },
                    didLongPress: function (sender, indexPath, data) {
                        $ui.menu({
                            items: ["在浏览器中打开", "分享"],
                            handler: function (title, idx) {
                                if (idx === 0) {
                                    $app.openURL(data.url.text)
                                } else {
                                    $share.sheet([data.url.text, data.postTitle.text])
                                }
                            }
                        })
                    },
                    didReachBottom: function (sender) {
                        sender.endFetchingMore()
                        _page += 1
                        loadSspaiArticle(_page)
                        $device.taptic(0)
                    },
                    pulled: function (sender) {
                        if (search_key == null) {
                            $("postList").beginRefreshing()
                            $("postList").data = []
                            loadSspaiArticle(_page)
                            $("postList").endRefreshing()
                        } else {
                            $("postList").endRefreshing()
                        }
                    }
                }
            }
        ]
    }],
    events: {
        didAppear: function () {
            if (popDelegate != null) {
                $("list").runtimeValue().$viewController().$navigationController().$interactivePopGestureRecognizer().$setDelegate(popDelegate)
            }
        }
    }
})

loadSspaiArticle(_page)

function loadSspaiArticle(_page) {
    $http.get({
        url: "https://api.jifangcheng.com/fish/more?next_page=" + _page,
        header: {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
        },
        handler: function (resp) {
            let allData = resp.data
            $ui.loading(true)
            for (var data in allData["articles"]) {
                let infors = allData["articles"][data]
                $("postList").insert({
                    index: $("postList").data.length,
                    value: {
                        url: {
                            text: infors["source"]
                        },
                        postTitle: {
                            text: infors["title"].split("-")[0]
                        },
                        imgNum: {
                            text: "内含" + String(infors["image_num"]) + "张图片"
                        },
                        img_list: {
                            array: infors["content"]
                        }
                    }
                })
            }
        }
    })
}

function getNews(img_list) {

    $ui.push({
        props: {
            title: "钓鱼贴",
            id: "img",
            navBarHidden: true,
            statusBarStyle: 0
        },
        views: [{
            type: "list",
            props: {
                data: img_list.map(item => {
                    return {
                        image: {
                            src: item
                        }
                    }
                }),
                rowHeight: __height,
                separatorHidden: true,
                template: {
                    props: {
                        bgcolor: $color("clear")
                    },
                    views: [{
                        type: "image",
                        layout: function (make, view) {
                            make.center.equalTo(view.super)
                            make.size.equalTo($size(__width, __height))
                        }
                    }]
                }
            },
            events: {
                didLongPress: function (sender, indexPath, data) {
                    $ui.menu({
                        items: ["查看原图", "分享图片"],
                        handler: function (title, idx) {
                            if (idx === 0) {
                                $ui.push({
                                    props: {
                                        navBarHidden: true
                                    },
                                    views: [{
                                        type: "web",
                                        props: {
                                            url: data.image.src
                                        },
                                        layout: $layout.fill
                                    }]
                                });
                            } else {
                                $http.download({
                                    url: data.image.src,
                                    showsProgress: true,
                                    progress: function (bytesWritten, totalBytes) {
                                        var percentage = bytesWritten * 1.0 / totalBytes
                                    },
                                    handler: function (resp) {
                                        $share.sheet(resp.data)
                                    }
                                })
                            }
                        }
                    })
                }
            },
            layout: $layout.fill,
        }],
        events: {
            didAppear: function (sender) {
                popDelegate = $("web").runtimeValue().$viewController().$navigationController().$interactivePopGestureRecognizer().$delegate()
                $("web").runtimeValue().$viewController().$navigationController().$interactivePopGestureRecognizer().$setDelegate(null)
            }
        }
    })
}

function getNewVersion() {
    $http.get({
        url: "https://raw.githubusercontent.com/alpha87/JsBoxScript/master/%E7%9F%A5%E4%B9%8E%E9%92%93%E9%B1%BC%E8%B4%B4.js",
        handler: function (resp) {
            var data = resp.data
            var versionItem = new RegExp('const __version = "(.*?)v";', "g")
            var version = versionItem.exec(data)[1]
            if (version > __version) {
                $ui.alert({
                    title: "检测到新版本",
                    message: "是否现在更新到最新版本",
                    actions: [{
                            title: "更新",
                            handler: function () {
                                $http.download({
                                    url: "https://raw.githubusercontent.com/alpha87/JsBoxScript/master/%E7%9F%A5%E4%B9%8E%E9%92%93%E9%B1%BC%E8%B4%B4.js",
                                    showsProgress: false,
                                    handler: function (resp) {
                                        $addin.save({
                                            name: "知乎钓鱼贴",
                                            data: resp.data,
                                            icon: $addin.current.icon,
                                            handler: function (success) {
                                                $ui.alert({
                                                    title: "完成",
                                                    message: "已更新到最新版本！",
                                                    actions: [{
                                                            title: "使用最新版",
                                                            handler: function () {
                                                                $app.close();
                                                            }
                                                        },
                                                        {
                                                            title: "暂时不退出"
                                                        }
                                                    ]
                                                });
                                            }
                                        })
                                    }
                                })
                            }
                        },
                        {
                            title: "取消",
                        }
                    ]
                })
            }
        }
    })
}