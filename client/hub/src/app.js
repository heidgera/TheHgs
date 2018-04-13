'use strict';

window.appData = {};

//muse.useSSL = true;
var obtains = [
  `./src/accountManagement.js`,
  'µ/dataChannel.js',
  'µ/commandClient.js',
  'µ/components/index.js',
];

obtain(obtains, (user, { DataChannel }, { MuseControl }, comps)=> {

  exports.app = {};

  exports.app.start = ()=> {
    user.init();
    console.log('starting...');

    var ws = new MuseControl(window.location.hostname);
    var channel = new DataChannel(ws);

    channel.addListener('message', (msg)=> {
      //µ('#msgText').textContent = msg;
      console.log(msg);
    });

    /*µ('#msgBox').onkeyup = (e)=> {
      if (e.keyCode == 13) {
        channel.send({ message: µ('#user').value });
        µ('#user').value = '';
      }
    };*/

    channel.onConnect = ()=> {
      //ws.close();
      console.log('Connected to remote');
      //channel.send({ message: 'test message from a client' });
      channel.send('profile:view', { user: appData.user });

      channel.addListener('profile:view', (data)=> {
        console.log(data);
      });
    };

    ws.onConnect = ()=> {
      console.log('connected to websocket');
    };

    ws.addListener('setId', (id)=> {
      console.log('Set id to ' + id);
      ws.id = id;
    });

    ws.addListener('route:redirect', (data)=> {
      document.title = data.title;
      history.pushState(appData, data.title, data.path);
    });

    ws.addListener('user:account', (data)=> {
      console.log('here');
      user.handleData(data);
    });

    ws.addListener('error', (msg)=> {
      console.log(msg);
    });

    ws.connect();

    document.onkeypress = (e)=> {
      if (e.key == ' ') console.log('Space pressed');
    };

  };

  provide(exports);
});
