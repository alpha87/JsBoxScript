var app = require('scripts/app');
var todayApp = require('scripts/today');

if ($app.env !== $env.today) {
    $ui.loading("客官稍等片刻")
    app.main()
} else {
    todayApp.main()
}