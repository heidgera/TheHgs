'use strict';

obtain(['µ/dataChannel.js', 'µ/commandClient.js'], ({ DataChannel }, { MuseControl })=> {
  console.log(window.location);

  var ws = new MuseControl(window.location.hostname);

  var connected = false;

  ws.onConnect = ()=> {
    connected = true;
  };

  exports.app = {};

  exports.app.start = ()=> {
    ws.connect();
    console.log('started');

    function uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }

    ws.on;
    µ('#_id').value = 'the-hgs';
    ws.setId(µ('#_id').value);
    channel = new DataChannel(ws);

    channel.addListener('message', (msg)=> {
      console.log(msg);
    });

    channel.onConnect = ()=> {
      channel.send({ message: 'test message from ' + µ('#_id').value });
    };

    µ('#connect').onclick = ()=> {
      console.log(µ('#_id').value);
      channel.connect(µ('#remote').value);

    };

    document.onkeypress = (e)=> {
      if (e.key == ' ') console.log('Space pressed');
    };

  };

  provide(exports);
});
