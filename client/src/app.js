'use strict';

obtain(['µ/dataChannel.js', 'µ/commandClient.js'], ({ DataChannel }, { MuseControl })=> {

  exports.app = {};

  exports.app.start = ()=> {
    var ws = new MuseControl(window.location.hostname);
    var channel = new DataChannel(ws);

    channel.addListener('message', (msg)=> {
      µ('#msgText').textContent = msg;
    });

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
