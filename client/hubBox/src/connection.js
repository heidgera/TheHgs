var obtains = [
  'µ/dataChannel.js',
  'µ/commandClient.js',
];

obtain(obtains, ({ DataChannel }, { MuseControl })=> {
  exports.channels = {};

  var ws = null;

  exports.onNewChannel = (cb)=> {

  };

  exports.setup = (config)=> {
    ws = new MuseControl(config.cnxnURL);

    ws.onConnect = ()=> {
      //ws.setId(config.name);
      ws.send({ requestNickname: {
        name: config.name,
        key: config.key,
      }, });

      ws.addListener('setId', (id)=> {
        ws.id = id;
      });

      ws.addListener('nameRequest', (approved)=> {
        if (!approved) {
          console.log('name taken');
          config.name = '';
          µ('#name').value = '';
        } else console.log('registered as ' + config.name);
      });

      console.log('adding listener');

      ws.addListener('cnxnRequest', (req)=> {
        console.log('cnxn');
        if (req.auth && !exports.channels[req.fromId] && req.toId == ws.id) {
          console.log('got connection request');
          var channel = new DataChannel(ws);
          var open = false;

          channel.connect(req.fromId);

          channel.id = req.id;

          exports.channels[req.id] = channel;

          channel.addListener('message', (msg)=> {
            console.log(msg);
          });

          channel.onConnect = ()=> {
            open = true;
            console.log('sending test message');
            var count = 0;
            /*setInterval(()=> {
              if (open) channel.send({ message: 'test message ' + count++ });
            }, 1000);*/
            channel.send({ message: 'test message from ' + config.name });
            exports.onNewChannel(channel);
          };

          channel.onClose = ()=> {
            console.log('closing channel');
            open = false;
            delete exports.channels[req.fromId];
          };
        }

      });

    };

    ws.connect();
  };

  exports.channels = {};
  exports.ws = ws;

  provide(exports);
});
