if (!window) var window = global;

var obtains = [
  `${__dirname}/server/express.js`,
  `${__dirname}/server/wsServer.js`,
  `${__dirname}/saltHash.js`,
  'path',
  'request',
];

obtain(obtains, ({ fileServer, router }, { wss }, saltHash, path, request)=> {

  var sent = false;

  var nameKeys = {};

  fileServer.set('views', path.join(__dirname, '../../client/views'));

  // router.param('hub', (req, res, next, hub)=> {
  //   var nKey = nameKeys[req.params.hub];
  //   var hubId = nKey && nKey.ws && nKey.ws.id;
  //   req.session.remoteId = hubId;
  //   req.session.remoteName = req.params.hub;
  //   next();
  // });

  router.get('/hub/:hub', (req, res)=> {
    var nKey = nameKeys[req.params.hub];
    var hubId = nKey && nKey.ws && nKey.ws.id;
    req.session.remoteId = hubId;
    req.session.remoteName = req.params.hub;
    res.render('hub.pug', { title: req.params.hub, hubName:  hubId });
  });

  router.post('/auth/:hub', (req, res)=> {
    console.log('authenticating to ' + req.params.hub);
    var nKey = nameKeys[req.params.hub];
    var hubId = nKey && nKey.ws && nKey.ws.id;
    var authWS = wss.orderedClients[hubId];
    if (authWS) {
      var oldVerified = req.session.verified;
      authWS.addListener('verify', deets=> {
        req.session.userId = deets.id;
        req.session.homeId = hubId;
        req.session.verified = deets.verified;
        req.session.user = req.body.user;
        //res.cookie('name', 'value', { signed: true });
        res.json({ verified: deets.verified });

        requestConnection(req);
      });
      wss.send(hubId, { verify: { user: req.body.user, pass: saltHash.simpleHash(req.body.pass) } });
    }
  });

  // router.get('/direct/:hub/:route(\\S+)', (req, res)=> {
  //   var nKey = nameKeys[req.params.hub];
  //   var hub = nKey && nKey.ws && nKey.ws.id;
  //   res.render('hub.pug', { title: req.params.hub, hubName:  hubId, spokeName: req.params.spoke });
  // });

  var requestConnection = (req)=> {
    if (req.session.remoteId && !!wss.orderedClients[req.session.remoteId]) {
      wss.send(req.session.remoteId, { cnxnRequest: {
        user: {
          name: req.session.user,
          id: req.session.userId,
          trusted: req.session.verified,
        },
        fromId: req.session.id,
        toId: req.session.remoteId,
      }, });
    } else if (req.session.remoteName) {
      wss.send(req.session.id, { error: 'fourohfour' });
    } else {
      console.log('did not request connection');
    }
  };

  wss.onClientConnect = (ws, req)=> {
    if (req) {
      console.log('client connected');
      var id = req.session.id;
      wss.orderedClients[req.session.id] = ws;
      console.log(id);
      ws.id = req.session.id;
      req.session.ws = ws;

      console.log('sending id:');
      wss.send(ws.id, { setId: ws.id });

      if (req.session.remoteName) {
        ws.remote = req.session.remoteName;
        console.log(ws.remote + ' is the remote name');
      }

      if (req.session.verified) requestConnection(req);
      else {
        wss.send(ws.id, { login: '' });
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

    console.log('passing connection candidate from' + (ws.remote ? 'client' : 'box'));
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

  wss.addListener('relay', (data, req)=> {
    wss.send(data.toId, { relay: data.data });
  });

  wss.addListener('offer', (data, req, ws)=> {
    console.log('passing local description from ' + (ws.remote ? 'client' : 'box'));
    if (wss.orderedClients[data.target]) {
      console.log(data.target);
      wss.send(data.target, { error: data });
      wss.send(data.target, { offer: data });
    } else {
      wss.send(ws.id, { error: 'No such client' });
    }
  });
});
