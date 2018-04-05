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
      var id = req.session.id;
      wss.orderedClients[req.session.id] = ws;
      ws.id = req.session.id;

      if (req.session.remoteId && !!wss.orderedClients[req.session.remoteId]) {
        wss.send(req.session.remoteId, { cnxnRequest: {
          auth: true,
          fromId: ws.id,
          toId: req.session.remoteId,
        }, });
      } else if (req.session.remoteName) {
        wss.send(ws.id, { error: 'fourohfour' });
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
    if (wss.orderedClients[data.target]) {
      wss.send(data.target, { offer: data });
    } else {
      wss.send(ws.id, { error: 'No such client' });
    }
  });
});
