$ui.render({
    props: {
        title: "CC Live"
    },
    views: [{
        type: "view",
        props: {
            id: ""
        },
        views: [
            {
                type: "label",
                props: {
                    id: "liveNameLabel",
                    text: "Hello, World!",
                    autoFontSize: true,
                    font: $font("bold", 22),
                    align: $align.center
                },
                layout: function (make, view) {
                    make.top.center.equalTo()
                }
            },
            // {
            //     type: "input",
            //     props: {
            //         id: "searchNameInput",
            //         type: $kbType.search,
            //     },
            //     layout: function (make, view) {
            //         make.size.equalTo($size(100, 30))
            //         make.top.equalTo($("liveNameLabel"))
            //         make.left.equalTo($("liveNameLabel").right).inset(5)
            //     }
            // }
        ],
        layout: $layout.fill
    }]
})
