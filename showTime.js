var text = "北京有什么旅游景点";

var appKey = "vRY8V88OPuxVJFim";
var appId = 1106867585;
var timeStamp = parseInt(Date.parse(new Date()).toString().slice(0, 10));
var nonceStr = $text.MD5(timeStamp.toString());
var session = nonceStr.toUpperCase();
var question = $text.URLEncode(text);
var _params = "app_id=" + appId + "&nonce_str=" + nonceStr + "&question=" + question + "&session=" + session + "&time_stamp=" + timeStamp + "&app_key=" + appKey;
var sign = $text.MD5(_params).toUpperCase()

var _par = "app_id=" + appId + "&nonce_str=" + nonceStr + "&question=" + question + "&session=" + session + "&sign=" + sign + "&time_stamp=" + timeStamp + "&app_key=" + appKey;

$http.get({
    url: "https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat?"+_par,
    handler: function (resp) {
        var data = resp.data
        $console.info(data)
    }
})