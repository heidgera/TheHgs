'use strict';

obtain(['./src/connection.js'], (cnxn)=> {

  muse.debug = true;

  exports.app = {};
  var config = {};
  config.cnxnURL = '127.0.0.1';
  config.name = 'box';
  config.key = 'secure';

  exports.app.start = ()=> {
    µ('#name').value = config.name;
    µ('#cnxnURL').value = config.cnxnURL || '127.0.0.1';;

    µ('#saveCfg').onclick = (e)=> {
      config.name = µ('#name').value;
      config.cnxnURL = µ('#cnxnURL').value;
      //fs.writeFileSync(confDir, JSON.stringify(config));
    };

    cnxn.setup(config);

    cnxn.onNewChannel = (channel)=> {
      channel.addListener('message', (data)=> {
        for (var id in cnxn.channels) {
          if (cnxn.channels.hasOwnProperty(id)) {
            if (id != channel.id) cnxn.channels[id].send({ message: data });
          }
        }
      });

    };

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
