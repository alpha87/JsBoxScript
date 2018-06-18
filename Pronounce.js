$input.text({
    type: $kbType.ascii,
    placeholder: "输入单词",
    text: $clipboard.text,
    handler: function (text) {
        $ui.loading("加载中")
        $audio.play({
            url: "https://ali.baicizhan.com/r/" + text.trim() + ".mp3"
        })
        $ui.loading(false)
    }
})