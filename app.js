//var sendEmail = require('./email.js').sendEmail;
'use strict';

var server = require('http').createServer();
var url = require('url');

//var WebSocketServer = require('ws').Server;
//var wss = new WebSocketServer({ server: server });
var express = require('express');
var subdomain = require('express-subdomain');
var port = 80;

var bodyParser = require('body-parser');

var dirname = __dirname + '/public';

var app = express();
var router = express.Router();

var babyTime = require('./babyTime.js');

//router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

console.log(dirname + '/babyLog');

//router.use(express.static(dirname + '/babyLog/'));

router.get('/', function(req, res) {
  console.log('getting subdomain');
  res.sendFile(dirname + '/babyLog/index.html');
});

router.get('/babyTimes.json', function(req, res) {
  babyTime.makeJSON(res);
});

router.post('/newEvent', babyTime.handlePostData);

router.get('/sort', function(req, res) {
  //babyTime.sortData();
  res.send('sorted');
});

/*router.get('/babyLog', function(req, res) {
  res.sendFile(dirname + '/babyLog/index.html');
});*/

app.use(subdomain('babylog', router));
app.use(express.static(dirname));

/*wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);

  ws.send('something');
});*/

server.on('request', app);
server.listen(port, function() { console.log('Listening on ' + server.address().port); });
