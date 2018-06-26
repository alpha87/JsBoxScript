String.prototype.urlsafe = function () {
    return this.replace(/\+/g, "-").replace(/\//g, "_")
}
var CryptoJS = require("crypto-js")
var AK = "WR1-2JkrICcpLvdw15L"
var SK = "1blyh54_uoulFjMPPAt"
var bucket = "jspt"
var domain = "p5jdshw2w.bkt.clouddn.com"
var deadline = Math.round(new Date().getTime() / 1000) + 1 * 3600
var params = { scope: bucket, deadline: deadline }
var policy = JSON.stringify(params)
var policyEncoded = $text.base64Encode(policy).urlsafe()
var sign = CryptoJS.HmacSHA1(policyEncoded, SK)
var signEncoded = sign.toString(CryptoJS.enc.Base64).urlsafe()
var token = AK + ":" + signEncoded + ":" + policyEncoded

function pickImage() {
    $photo.pick({
        format: "image",
        handler: function (resp) {
            var image = resp.image
            image ? upload(image) : null
        }
    })
}

function upload(image) {
    $http.upload({
        url: "http://up-z1.qiniu.com/",
        form: {
            token: token
        },
        files: [{
            "image": image,
            "name": "file",
            "filename": "file"
        }],
        handler: function (resp) {
            if (resp.data.key) {
                var url = "http://" + domain + "/" + resp.data.key
                $clipboard.text = url
                $device.taptic(0)
                $ui.toast("链接已复制到剪贴板")
            } else {
                $ui.toast(resp.data.error)
            }
        }
    })
}

pickImage()
