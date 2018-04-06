if (!window) var window = global;

var obtains = [
  './server/express.js',
  './server/wsServer.js',
  'path',
  'request',
];

obtain(obtains, ({ fileServer, router }, { wss }, path, request)=> {

  var sent = false;

  var nameKeys = {};

  fileServer.set('views', path.join(__dirname, '../../client/views'));

  router.get('/hub/:hub', (req, res)=> {
    var nKey = nameKeys[req.params.hub];
    var hubId = nKey && nKey.ws && nKey.ws.id;
    req.session.remoteId = hubId;
    req.session.remoteName = req.params.hub;
    res.render('hub.pug', { title: req.params.hub, hubName:  hubId });
  });

  router.get('/direct/:hub/:spoke', (req, res)=> {
    var nKey = nameKeys[req.params.hub];
    var hub = nKey && nKey.ws && nKey.ws.id;
    res.render('hub.pug', { title: req.params.hub, hubName:  hubId, spokeName: req.params.spoke });
  });

  wss.onClientConnect = (ws, req)=> {
    if (req) {
      console.log('client connected');
      var id = req.session.id;
      wss.orderedClients[req.session.id] = ws;
      console.log(id);
      ws.id = req.session.id;

      if (req.session.remoteName) {
        ws.remote = req.session.remoteName;
        console.log(ws.remote);
      }

      console.log('sending id:');
      wss.send(ws.id, { setId: ws.id });

      if (req.session.remoteId && !!wss.orderedClients[req.session.remoteId]) {
        wss.send(req.session.remoteId, { cnxnRequest: {
          auth: true,
          fromId: ws.id,
          toId: req.session.remoteId,
        }, });
      } else if (req.session.remoteName) {
        wss.send(ws.id, { error: 'fourohfour' });
      } else {
        console.log('did not request connection');
      }
    }

  };

  wss.onClientDisconnect = (req)=> {
    console.log('client disconnect');
    if (req) {
      delete wss.orderedClients[req.session.id];
    }
  };

  wss.addListener('connect', (data, req, ws)=> {

    console.log('passing connection candidate:');
    if (wss.orderedClients[data.target]) {
      wss.send(data.target, { connect: data });
    } else {
      wss.send(ws.id, { error: 'No such client' });
    }
  });

  wss.addListener('requestNickname', (data, arr, ws)=> {
    var res = { nameRequest: '' };
    if (!nameKeys[data.name] || nameKeys[data.name].key == data.key) {
      nameKeys[data.name] = { key: data.key, ws: ws };
      res.nameRequest = true;
    } else res.nameRequest = false;
    wss.send(ws.id, res);
  });

  /*wss.addListener('cnxnRequest', (data, req)=> {
    wss.send(data.toId, { cnxnRequest: data });
  });*/

  wss.addListener('offer', (data, req, ws)=> {
    console.log('passing local description from ' + (ws.remote ? 'client' : 'box'));
    console.log(data);
    if (wss.orderedClients[data.target]) {
      console.log(data.target);
      wss.send(data.target, { error: data });
      wss.send(data.target, { offer: data });
    } else {
      wss.send(ws.id, { error: 'No such client' });
    }
  });
});
