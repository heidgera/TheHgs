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

  router.get('/hub/:hub', (req, res)=> {
    var hub = hubs.find('name', req.params.hub);
    req.session.remoteId = hub && hub.id;
    req.session.remoteName = req.params.hub;
    //res.render('hub.pug', { title: req.params.hub, hubName:  hub && hub.id });
    if (req.session.user) res.sendFile(path.join(__dirname, '../../client/hub', 'index.html'));
    else {
      req.session.redirect = hub.name;
      res.redirect('/hub');
    }
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
        fromId: req.session.id,
        toId: req.session.remoteId,
      });
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

  wss.onClientConnect = (ws, req)=> {
    if (req) {
      console.log('client connected');
      var id = req.session.id;
      wss.orderedClients[req.session.id] = ws;
      console.log(id);
      ws.id = req.session.id;
      req.session.ws = ws;

      console.log('sending id:');
      wss.send(ws.id, { setId: id });

      if (req.session.remoteName) {
        ws.remote = req.session.remoteName;
        console.log(ws.remote + ' is the remote name');
      }

      var user = req.session.user;

      if (user && user.trusted) {
        wss.send(req.session.id, 'user:account', req.session.user);
        requestConnection(req);
      } else console.log('sending acct'), wss.send(req.session.id, 'user:account', false);
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

  wss.addListener('cnxn:setName', (data, arr, ws)=> {
    data.ws = ws;
    data.cnxnId = ws.id;

    wss.send(ws.id, 'cnxn:setName', hubs.register(data));
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
