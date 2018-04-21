if (!window) var window = global;

var obtains = [
  `${__dirname}/server/express.js`,
  `${__dirname}/server/wsServer.js`,
  `${__dirname}/saltHash.js`,
  `${__dirname}/userManagement.js`,
  `${__dirname}/hubManagement.js`,
  'path',
  'request',
];

obtain(obtains, ({ fileServer, router }, { wss }, saltHash, users, hubs, path, request)=> {

  var sent = false;

  fileServer.set('views', path.join(__dirname, '../../client/views'));

  // router.param('hub', (req, res, next, hub)=> {
  //   var nKey = nameKeys[req.params.hub];
  //   var hubId = nKey && nKey.ws && nKey.ws.id;
  //   req.session.remoteId = hubId;
  //   req.session.remoteName = req.params.hub;
  //   next();
  // });

  router.post('/hub/:hub', (req, res)=> {
    var hub = hubs.find('name', req.params.hub);
    if (hub) {
      console.log('asking to be connected to ' + hub.name);
      req.session.query = req.body.query;
      wss.send(hub.id, 'cnxn:request', {
        user: req.session.user,
        query: req.session.query,
        fromId: req.session.id,
        toId: hub.id,
      });
      res.json({ ['cnxn:request']: true });
    } else {
      res.json({ ['cnxn:request']: false });
    }
  });

  router.post('/hub/byId/:hub', (req, res)=> {
    var hub = hubs.find('uuid', req.params.hub);
    if (hub) {
      console.log('asking to be connected to ' + hub.name);
      req.session.query = req.body.query;
      wss.send(hub.id, 'cnxn:request', {
        user: req.session.user,
        query: req.session.query,
        fromId: req.session.id,
        toId: hub.id,
      });
      res.json({ ['cnxn:request']: { hubId: hub.id } });
    } else {
      res.json({ ['cnxn:request']: false });
    }
  });

  router.get('/hub/:hub', (req, res)=> {
    if (req.params.hub != 'null') {
      console.log('Received GET request for ' + req.params.hub);
      var hub = hubs.find('name', req.params.hub);
      if (hub) console.log('found ' + req.params.hub);
      req.session.remoteId = hub && hub.id;
      req.session.remoteName = req.params.hub;
      req.session.remoteUUID = hub && hub.uuid;
      req.session.query = { type: 'default' };
    }

    res.sendFile(path.join(__dirname, '../../client/hub', 'index.html'));
  });

  // router.get('/direct/:hub/:route(\\S+)', (req, res)=> {
  //   var nKey = nameKeys[req.params.hub];
  //   var hub = nKey && nKey.ws && nKey.ws.id;
  //   res.render('hub.pug', { title: req.params.hub, hubName:  hubId, spokeName: req.params.spoke });
  // });

  var requestConnection = (req)=> {
    if (req.session.remoteId && !!wss.orderedClients[req.session.remoteId]) {
      wss.send(req.session.remoteId, 'cnxn:request', {
        user: req.session.user,
        query: req.session.query,
        fromId: req.session.id,
        toId: req.session.remoteId,
      });
      req.session.query = null;
      //wss.send(req.session.id, 'user:account', req.session.user);
    } else if (req.session.remoteName) {
      wss.send(req.session.id, { error: 'fourohfour' });
    } else {
      console.log('did not request connection');
    }
  };

  users.onLogin = (req)=> {
    if (req.session.redirect) {
      wss.send(req.session.id, 'route:redirect', {
        path: `/hub/${req.session.redirect}`,
        title: req.session.redirect,
      });
      req.session.redirect = null;
      requestConnection(req);
    }
  };

  users.onLogout = (req)=> {
    wss.send(req.session.id, 'route:redirect', {
      path: `/hub/`,
      title: 'Login',
    });
    requestConnection(req);
  };

  var updateHubID = (uuid)=> {
    var hub = hubs.find('uuid', uuid);
    return hub && hub.id;
  };

  wss.onClientConnect = (ws, req)=> {
    if (req) {
      console.log('client connected');
      var id = req.session.id;
      wss.orderedClients[req.session.id] = ws;
      console.log(id);
      ws.id = req.session.id;
      req.session.ws = ws;

      //wss.send(ws.id, { setId: id });

      if (req.session.remoteName) {
        ws.remote = req.session.remoteName;
        console.log(ws.remote + ' is the remote name');
      }

      var user = req.session.user;
      console.log(user);

      if (user && user.trusted) {
        wss.send(req.session.id, 'user:account', req.session.user);
      } else wss.send(req.session.id, 'user:account', false);

      requestConnection(req);
    }

  };

  wss.onClientDisconnect = (req)=> {
    console.log('client disconnect');
    if (req) {
      delete wss.orderedClients[req.session.id];
    }
  };

  wss.addListener('cnxn:candidate', (data, req, ws)=> {
    if (!data.from) data.from = ws.id;
    console.log('passing connection candidate from' + (ws.remote ? 'client' : 'box'));
    if (wss.orderedClients[data.to]) {
      wss.send(data.to, 'cnxn:candidate', data);
    } else {
      wss.send(ws.id, { error: 'No such client' });
    }
  });

  wss.addListener('cnxn:setName', (data, arr, ws)=> {
    data.ws = ws;
    data.cnxnId = ws.id;

    wss.send(ws.id, 'cnxn:setName', hubs.register(data));
  });

  wss.addListener('cnxn:relay', (data, req, ws)=> {
    if (!data.from) data.from = ws.id;
    wss.send(data.to, 'cnxn:relay', data);
  });

  wss.addListener('cnxn:description', (data, req, ws)=> {
    if (!data.from) data.from = ws.id;
    console.log('passing local description from ' + (ws.remote ? 'client' : 'box'));
    if (wss.orderedClients[data.to]) {
      console.log(data.to);
      wss.send(data.to, 'cnxn:description', data);
    } else {
      wss.send(ws.id, { error: 'No such client' });
    }
  });
});
