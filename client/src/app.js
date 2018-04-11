'use strict';

muse.useSSL = true;

obtain(['µ/dataChannel.js', 'µ/commandClient.js'], ({ DataChannel }, { MuseControl })=> {

  exports.app = {};

  exports.app.start = ()=> {
    var ws = new MuseControl(window.location.hostname);
    var channel = new DataChannel(ws);

    channel.addListener('message', (msg)=> {
      µ('#msgText').textContent = msg;
    });

    µ('#user').onkeyup = (e)=> {
      if (e.keyCode == 13) {
        channel.send({ message: µ('#user').value });
        µ('#user').value = '';
      }
    };

    channel.onConnect = ()=> {
      //ws.close();
      console.log('sending test message');
      channel.send({ message: 'test message from a client' });
    };

    ws.onConnect = ()=> {
      console.log('connected to websocket');
    };

    ws.addListener('setId', (id)=> {
      console.log('Set id to ' + id);
      ws.id = id;
    });

    ws.addListener('login', ()=> {
      console.log('not logged in');
      post('http://' + window.location.hostname + '/auth/box', {
        user: 'admin',
        pass: 'admin',
      }).then((res)=> {
        var ret = JSON.parse(res);
        console.log(ret);
      });
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
