'use strict';

obtain(['µ/dataChannel.js', 'µ/commandClient.js'], ({ DataChannel }, { MuseControl })=> {
  exports.app = {};
  var config = {};
  config.cnxnURL = '172.24.0.90';
  config.name = 'box';
  config.key = 'secure';

  var ws = new MuseControl(config.cnxnURL);

  var channels = {};

  ws.onConnect = ()=> {
    //ws.setId(config.name);
    ws.send({ requestNickname: {
      name: config.name,
      key: config.key,
    }, });

    ws.addListener('nameRequest', (approved)=> {
      if (!approved) {
        console.log('name taken');
        config.name = '';
        µ('#name').value = '';
      } else console.log('registered as ' + config.name);
    });

    ws.addListener('cnxnRequest', (req)=> {
      if (req.auth && !channels[req.fromId]) {
        console.log('got connection request');
        var channel = new DataChannel(ws);

        ws.id = req.toId;
        channel.connect(req.fromId);

        channel.addListener('message', (msg)=> {
          console.log(msg);
        });

        channel.onConnect = ()=> {
          console.log('sending test message');
          channel.send({ message: 'test message from ' + config.name });
        };

        channel.onClose = ()=> {
          console.log('closing channel');
          delete channels[req.fromId];
        };

        channels[req.id] = channel;
      }

    });

  };

  exports.app.start = ()=> {
    µ('#name').value = config.name;
    µ('#cnxnURL').value = config.cnxnURL || '127.0.0.1';;

    µ('#saveCfg').onclick = (e)=> {
      config.name = µ('#name').value;
      config.cnxnURL = µ('#cnxnURL').value;
      //fs.writeFileSync(confDir, JSON.stringify(config));
    };

    ws.connect();

    console.log('started');

    document.onkeypress = (e)=> {
      //if (e.key == ' ') console.log('Space pressed'), hardware.digitalWrite(13, 1);
    };

    document.onkeyup = (e)=> {
      if (e.which == 27) {
        var electron = require('electron');
        //process.kill(process.pid, 'SIGINT');
      } else if (e.which == 73 && e.getModifierState('Control') &&  e.getModifierState('Shift')) {
        //remote.getCurrentWindow().toggleDevTools();
      }
    };

    // process.on('SIGINT', ()=> {
    //   process.nextTick(function () { process.exit(0); });
    // });
  };

  provide(exports);
});
