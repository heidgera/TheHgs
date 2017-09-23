require('./local/src/obtain.js');

const local = './local/src/';

var obtains = [
  `./server/express.js`,
  `./server/wsServer.js`,
  'child_process',
];

obtain(obtains, ({ fileServer }, { wss }, { exec })=> {
  setInterval(()=> {
    exec('arp -a', (err, stdout, stderr)=> {
      if (stdout.includes('64:bc:0c:4b:da:81')) console.log('Aaron is home');
      else console.log('Aaron is away');
    });
  }, 5000);
});
