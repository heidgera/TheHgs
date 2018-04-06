'use strict';

obtain(['µ/dataChannel.js', 'µ/commandClient.js'], ({ DataChannel }, { MuseControl })=> {
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

  // function uuidv4() {
  //   return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
  //     (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  //   );
  // }

  ws.onConnect = ()=> {

  };

  ws.addListener('error', (msg)=> {
    console.log(msg);
  });

  exports.app = {};

  exports.app.start = ()=> {

    console.log('here');
    ws.connect();

    document.onkeypress = (e)=> {
      if (e.key == ' ') console.log('Space pressed');
    };

  };

  provide(exports);
});
