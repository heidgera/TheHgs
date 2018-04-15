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
    var peers = new DataChannel(ws);

    var onHomeChannel = (peer)=> {
      peer.send('profile:view', { user: appData.user });
      peer.addListener('profile:view', (data)=> {
        if (data.id == appData.user.id) user.handleProfileData(data);
        else console.log('someone else');
      });
    };

    peers.onPeerConnect = (peer)=> {
      console.log('Connected to ' + peer.info.name);
      if (peer.info.id == appData.user.hubId) onHomeChannel(peer);

      peer.addListener('message', (msg)=> {
        console.log(msg);
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
