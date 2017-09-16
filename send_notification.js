
var pushpad = require('./src/services/pushpad')
var n = pushpad.createNotification('testnotification','testbody','http://localhost:4200/voucher/','');
n.broadcast({},() => {});