require('./common/src/muse/main.js');

if (require('os').platform != 'darwin') muse.useSSL = true;

global.tld = __dirname;

const local = './local/src/';

console.log('launching...');

var obtains = [
  `${tld}/local/src/server/express.js`,
  `${tld}/local/src/server/wsServer.js`,
  `${tld}/local/src/hubBook.js`,
  'child_process',
];

global.appData = {};

obtain(obtains, ({ fileServer, router }, { wss }, hubBook, { exec })=> {

  router.post('/security', function (req, res) {
    console.log(req.body);
    var obj = req.body;

    console.log(obj.password);

    ret = { success: true };

    res.json(ret);
  });

  router.post('/julia', function (req, res) {
    console.log(req.body);
    var obj = req.body;

    console.log(obj.password);
    console.log(obj.command);

    ret = { success: true };

    res.json(ret);
  });

});
