'use strict';

obtain(['../dataChannel.js', 'µ/commandClient.js'], ({ DataChannel }, { MuseControl })=> {

  var ws = new MuseControl(window.location.hostname);

  ws.onConnect = ()=> {
    ws.send({ _id: 'one' });
    var channel = new DataChannel('two', ws);
    channel.onOpen = ()=> {
      channel.send('test');
    };
  };

  exports.app = {};

  exports.app.start = ()=> {
    ws.connect();
    console.log('started');

    document.onkeypress = (e)=> {
      if (e.key == ' ') console.log('Space pressed');
    };

  };

  provide(exports);
});
