$ui.loading("获取视频中...")
// 获取视频名称
var reTitle = new RegExp('<title>(.*?)</title>')

// 获取当前视频封面
var reJpg = new RegExp('<img id="title" class="videoControl" src="(.*?)".*?>', 'm')

// 获取当前视频链接
var reMp4 = new RegExp('http://.*?mp4', 'm')

// 获取下一个视频ID
var reId = new RegExp('<li class="item-li open-app-normal" data-url="magicbox://video/(\\d+)')


function getId(vid) {
    $http.get({
        url: "http://magicapi.vmovier.com/magicapiv2/video/shareview?id=" + vid,
        handler: function (resp) {
            var data = resp.data
            playvideo(reTitle.exec(data)[1].slice(0, -5), reJpg.exec(data)[1], reMp4.exec(data)[0])
        }
    })
}

function playvideo(videoTitle, videoJpg, videoMp4) {
    $ui.loading(false)
    $ui.render({
        props: {
            title: "Magic Video"
        },
        views: [{
                type: "label",
                props: {
                    font: $font("bold", 15),
                    text: videoTitle
                },
                layout: function (make, view) {
                    make.top.equalTo(20)
                    make.centerX.equalTo()
                }
            },
            {
                type: "video",
                props: {
                    src: videoMp4,
                    poster: videoJpg,
                },
                layout: function (make, view) {
                    make.left.right.equalTo(0)
                    make.centerY.equalTo(-130)
                    make.height.equalTo(256)
                }
            },
            {
                type: "button",
                props: {
                    title: "随便看看",
                    titleEdgeInsets: $insets(5, 5, 5, 5)
                },
                layout: function (make, view) {
                    make.top.equalTo($("video").bottom).offset(50)
                    make.width.equalTo(100)
                    make.left.equalTo(50)
                },
                events: {
                    tapped: function (params) {
                        getId(String(Math.random() * 10000).slice(0, 4))
                    }
                }
            },
            {
                type: "button",
                props: {
                    title: "分享",
                    titleEdgeInsets: $insets(5, 5, 5, 5)
                },
                layout: function (make, view) {
                    make.top.equalTo($("video").bottom).offset(50)
                    make.width.equalTo(100)
                    make.right.equalTo(-50)
                },
                events: {
                    tapped: function (params) {
                        $share.sheet([videoMp4, videoTitle])
                    }
                }
            }
        ]
    })
}


getId(String(Math.random() * 10000).slice(0, 4))