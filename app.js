require('./local/src/obtain.js');

const local = './local/src/';

console.log('launching...');

var obtains = [
  `./server/express.js`,
  `./server/wsServer.js`,
  'child_process',
];

obtain(obtains, ({ fileServer, router }, { wss }, { exec })=> {

  //var server = PeerServer({ port: 9000, path: '/freebook' });

  //var AaronHomeState = false;

  /*setInterval(()=> {
    exec('sudo hostapd_cli all_sta', (err, stdout, stderr)=> {
      if (stdout.includes('64:bc:0c:4b:da:81')) {
        if (!AaronHomeState) {
          console.log('Aaron is home');
          devices.sunroomLamp.turnOn();
          AaronHomeState = true;
        }
      } else {
        if (AaronHomeState) {
          console.log('Aaron is away');
          devices.sunroomLamp.turnOff();
          AaronHomeState = false;
        }
      }
    });
  }, 5000);*/

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

  fileServer.start();

});
