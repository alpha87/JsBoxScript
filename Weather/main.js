var app = require('scripts/app');
var todayApp = require('scripts/today');

if ($app.env !== $env.today) {
    $ui.loading("客官稍等片刻")
    $app.tips("使用前记得查看使用须知哦！")
    app.main()
} else {
    todayApp.main()
}