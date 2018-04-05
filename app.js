require('./local/src/obtain.js');

global.tld = __dirname;

const local = './local/src/';

console.log('launching...');

var obtains = [
  `./server/express.js`,
  `./server/wsServer.js`,
  './hubBook.js',
  'child_process',
];

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
