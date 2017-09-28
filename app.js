require('./local/src/obtain.js');

const local = './local/src/';

var obtains = [
  `./server/express.js`,
  `./server/wsServer.js`,
  'child_process',
  './homeDevices.js',
];

obtain(obtains, ({ fileServer }, { wss }, { exec }, { devices })=> {

  //var server = PeerServer({ port: 9000, path: '/freebook' });

  setInterval(()=> {
    exec('sudo hostapd_cli all_sta', (err, stdout, stderr)=> {
      if (stdout.includes('64:bc:0c:4b:da:81')) {
        console.log('Aaron is home');
        devices.sunroomLamp.turnOn();
      } else {
        console.log('Aaron is away');
        devices.sunroomLamp.turnOff();
      }
    });
  }, 5000);
});
