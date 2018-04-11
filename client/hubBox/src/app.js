'use strict';

obtain(['./src/connection.js'], (cnxn)=> {

  muse.debug = true;

  exports.app = {};
  var config = {};
  config.cnxnURL = '127.0.0.1';
  config.name = 'box';
  config.key = 'secure';

  var users = [{ name: 'admin', id: '69157b9d-3785-4969-afb1-20f0351f12e6', hash: '775dfe537685d44f247b961557f4a56e0fe4ac0d09392b21c9e62a4934cd5506b3279850dc9084e17e16cdf4de2c0a9c4f2d9c3214421ab0b8adfdfa7ea35c67', salt: '66785d6443364fdf' }];

  exports.app.start = ()=> {
    µ('#name').value = config.name;
    µ('#cnxnURL').value = config.cnxnURL || '127.0.0.1';;

    µ('#saveCfg').onclick = (e)=> {
      config.name = µ('#name').value;
      config.cnxnURL = µ('#cnxnURL').value;
      //fs.writeFileSync(confDir, JSON.stringify(config));
    };

    cnxn.authUser = (deets)=> {
      var locl = users.find(user=>user.name == deets.user);
      if (!locl) return ({ id: '', verified: false });
      //console.log(locl);
      return { id: locl.id, verified: true };
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

      channel.send({ message: 'test call' });
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
