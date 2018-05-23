// 抓取列表
loadSspaiArticle()

// 数据源
var dataSource = {
    sspai: {
        title: "少数派",
        description: "少数派致力于更好地运用数字产品或科学方法，帮助用户提升工作效率和生活品质",
        logo: "https://cdn.sspai.com/sspai/assets/img/favicon/icon_152.png"
    },
    ifanr: {
        title: "爱范儿",
        description: "聚焦新创和消费主题的科技媒体，成立于 2008 年 10 月，关注产品及体验，致力于“独立，前瞻，深入”的原创报道和分析评论，是国内唯一一家在产业和产品领域同时具有强势影响力的科技媒体。旗下现有 ifanr.com、SocialBase.cn、AppSolution、玩物志、创业及产品社区 MindStore 等多个细分领域的知名产品。",
        logo: "https://images.ifanr.cn/wp-content/themes/ifanr-4.0/static/images/ifanr/top-nav-down-logo.png"
    },
    qdaily: {
        title: "好奇心日报",
        description: "好奇心日报以商业视角观察生活并启发你的好奇心，囊括商业报道、科技新闻、生活方式等各个领域，致力成为这个时代最好的媒体，为用户提供最好的新闻资讯。",
        logo: "https://is4-ssl.mzstatic.com/image/thumb/Purple128/v4/da/92/10/da92103b-3b43-4dce-599e-5350da400ded/AppIcon-1x_U007emarketing-0-85-220-3.png/230x0w.jpg"
    }
}


// 主视图列表模板
mainTemplate = [{
        type: "image",
        props: {
            id: "mainLogo",
            radius: 18,
        },
        layout: function (make) {
            make.left.equalTo(20)
            make.top.equalTo(10)
            make.size.equalTo($size(100, 100))
        }
    },
    {
        type: "label",
        props: {
            id: "mainTitle",
            font: $font("bold", 20),
        },
        layout: function (make) {
            make.top.equalTo($("mainLogo"))
            make.left.equalTo($("mainLogo").right).offset(20)
        }
    },
    {
        type: "label",
        props: {
            id: "mainDescription",
            lines: 4,
            font: $font(14)
        },
        layout: function (make) {
            make.top.equalTo($("mainTitle").bottom).offset(10)
            make.left.equalTo($("mainLogo").right).offset(20)
            make.right.inset(20)
        }
    }
]

var sourceData = []
for (source in dataSource) {
    sourceData.push({
        mainLogo: {
            src: dataSource[source].logo
        },
        mainTitle: {
            text: dataSource[source].title
        },
        mainDescription: {
            text: dataSource[source].description
        }
    })
}

// 主视图
$ui.render({
    props: {
        title: "碎片阅读"
    },
    views: [{
        type: "list",
        props: {
            id: "mainList",
            rowHeight: 120,
            separatorInset: $insets(0, 10, 0, 10),
            template: mainTemplate,
            data: sourceData
        },
        layout: $layout.fill,
        events: {
            didSelect: function (sender, indexPath, data) {
                $ui.loading("加载中...")
                $delay(0.7, function () {
                    otherPage($("mainList").data[indexPath.row].mainTitle.text)
                })
            }
        }
    }]
})

// 内容列表模板
articleTemplate = [{
        type: "image",
        props: {
            id: "articleImage",
        },
        layout: function (make, view) {
            make.height.equalTo(128)
            make.left.top.right.inset(1)
        }
    },
    {
        type: "image",
        props: {
            id: "articleAuthorImage",
            radius: 10,
        },
        layout: function (make) {
            make.left.equalTo(5)
            make.top.equalTo($("articleImage").bottom).offset(5)
            make.size.equalTo($size(50, 50))
        }
    },
    {
        type: "label",
        props: {
            id: "articleAuthor",
            font: $font("bold", 11),
        },
        layout: function (make) {
            make.top.equalTo($("articleAuthorImage"))
            make.left.equalTo($("articleAuthorImage").right).offset(10)
        }
    },
    {
        type: "label",
        props: {
            id: "articleDate",
            font: $font(12),
        },
        layout: function (make) {
            make.top.equalTo($("articleAuthor").bottom).offset(2)
            make.left.equalTo($("articleAuthor"))
        }
    },
    {
        type: "label",
        props: {
            id: "articleLike",
            font: $font(10),
        },
        layout: function (make) {
            make.top.equalTo($("articleDate").bottom).offset(5)
            make.left.equalTo($("articleAuthor")).offset(-3)
        }
    },
    {
        type: "label",
        props: {
            id: "articleComment",
            font: $font(10),
        },
        layout: function (make) {
            make.top.equalTo($("articleLike"))
            make.left.equalTo($("articleLike").right).offset(2)
        },
    },
    {
        type: "label",
        props: {
            id: "articleTitle",
            font: $font("bold", 14),
        },
        layout: function (make) {
            make.top.equalTo($("articleAuthor"))
            make.left.equalTo($("articleAuthor").right).offset(5)
        }
    },
    {
        type: "label",
        props: {
            id: "articleDescripiton",
            lines: 2,
            font: $font(12),
        },
        layout: function (make) {
            make.top.equalTo($("articleTitle").bottom).offset(5)
            make.left.equalTo($("articleTitle"))
            make.right.inset(5)
        }
    }
]

// 内容列表展示模板
var sspaiInfo = {
    url: "",
    image: "",
    authorImage: "",
    title: "",
    description: "",
    author: "",
    date: "",
    likes: "",
    comments: ""
}

var articleSspai = []

function loadSspaiArticle() {
    $http.get({
        url: "https://sspai.com/api/v1/articles?offset=0&limit=10&type=recommend_to_home&sort=recommend_to_home_at&include_total=true",
        header: {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
        },
        handler: function (resp) {
            let allData = resp.data
            let cdnUrl = "https://cdn.sspai.com/"
            for (data in allData["list"]) {
                let infors = allData["list"][data]
                sspaiInfo.url = "https://sspai.com/" + infors["id"]
                sspaiInfo.image = cdnUrl + infors["banner"]
                sspaiInfo.authorImage = cdnUrl + infors["author"].avatar
                sspaiInfo.title = infors["title"]
                sspaiInfo.description = infors["promote_intro"]
                sspaiInfo.author = infors["author"].nickname
                sspaiInfo.date = formatDate(infors["recommend_to_home_at"])
                sspaiInfo.likes = infors["likes_count"]
                sspaiInfo.comments = infors["comment_replys_count"]
                articleSspai.push({
                    articleUrl: {
                        url: sspaiInfo.url
                    },
                    articleImage: {
                        src: sspaiInfo.image
                    },
                    articleAuthorImage: {
                        src: sspaiInfo.authorImage
                    },
                    articleTitle: {
                        text: sspaiInfo.title
                    },
                    articleDescripiton: {
                        text: sspaiInfo.description
                    },
                    articleAuthor: {
                        text: sspaiInfo.author
                    },
                    articleDate: {
                        text: sspaiInfo.date
                    },
                    articleLike: {
                        text: "❤️" + sspaiInfo.likes
                    },
                    articleComment: {
                        text: "📝" + sspaiInfo.comments
                    }
                })
            }
        }
    })
}

// 内容视图
function otherPage(title) {
    if (!articleSspai) {
        $ui.alert({
            title: "网络错误",
            message: "请重试！",
        })
    } else {
        $ui.loading(false)
        $console.info(articleSspai)
        if (title == "少数派") {
            $ui.push({
                props: {
                    title: title
                },
                views: [{
                    type: "list",
                    props: {
                        id: "articleList",
                        rowHeight: 195,
                        separatorInset: $insets(0, 10, 0, 10),
                        template: articleTemplate,
                        data: articleSspai
                    },
                    layout: $layout.fill,
                    events: {
                        didSelect: function (sender, indexPath, data) {
                            getNews($("articleList").data[indexPath.row].articleUrl["url"])
                        }
                    }
                }]
            })
        }
    }
}

function getNews(_url) {
    let reTitle = new RegExp("<title>(.*?)</title>", 'g')
    $http.get({
        url: _url,
        header: {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
        },
        handler: function (resp) {
            var data = resp.data
            Title = reTitle.exec(data)[1]
            Body = data
            $ui.push({
                props: {
                    title: Title.slice(0, 9) + "..."
                },
                views: [{
                    type: "web",
                    props: {
                        url: _url
                    },
                    layout: $layout.fill
                }]
            })
        }
    })
}

function sspaiArticlePage(Title, Body) {

}

// 辅助函数
function formatDate(timestamp) {
    let date = new Date(timestamp * 1000)
    let month = date.getMonth() + 1
    let day = date.getDate()
    return month + "." + day
}