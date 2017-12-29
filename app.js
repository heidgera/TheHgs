require('./local/src/obtain.js');

const local = './local/src/';

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

    console.log(obj.password);

    ret = { success: true };

    res.json(ret);
  });

  fileServer.use(router);

});
