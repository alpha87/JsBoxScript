$input.text({
    type: $kbType.ascii,
    placeholder: "输入需要发音的单词",
    text: $clipboard.text,
    handler: function (text) {
        $ui.loading("加载中")
        $http.get({
            url: "https://ali.baicizhan.com/r/" + text.trim() + ".mp3",
            handler: function (resp) {
                var data = resp.data
                if (data.error) {
                    $ui.toast(data.error)
                    $ui.loading(false)
                } else {
                    $audio.play({
                        url: "https://ali.baicizhan.com/r/" + text.trim() + ".mp3"
                    })
                    $ui.loading(false)
                    $device.taptic(0)
                }
            }
        })
    }
})