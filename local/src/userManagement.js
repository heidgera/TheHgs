if (!window) var window = global;

var obtains = [
  `${__dirname}/server/express.js`,
  `${__dirname}/server/wsServer.js`,
  `${__dirname}/saltHash.js`,
  `${__dirname}/hubManagement.js`,
  'path',
  'request',
];

obtain(obtains, ({ fileServer, router }, { wss }, saltHash, hubs, path, request)=> {

  exports.onLogin = ()=> {};

  exports.onLogout = ()=> {};

  router.post('/auth/:hub', (req, res)=> {
    console.log('authenticating to ' + req.params.hub);
    var hub = hubs.find('name', req.params.hub);
    // var nKey = nameKeys[req.params.hub];
    // var hubId = nKey && nKey.ws && nKey.ws.id;
    var authWS = hub && wss.orderedClients[hub.id];
    if (authWS) {
      var oldVerified = req.session.user && req.session.user.trusted;
      authWS.addListener('user:verify', deets=> {
        req.session.user = {
          id: deets.verified && deets.id,
          trusted: deets.verified,
          name: req.body.user,
          hub: {
            name: hub.name,
            id: hub.uuid,
            cnxnId: hub.id,
          },
        };
        //res.cookie('name', 'value', { signed: true });
        exports.onLogin(req);
        console.log(req.session.user);
        res.json({ ['user:account']: req.session.user });

      });
      wss.send(hub.id, 'user:verify', { user: req.body.user, pass: saltHash.simpleHash(req.body.pass) });
    } else {
      res.json({ ['user:account']: { error: { type: ((!hub) ? 'NO_HUB' : 'HUB_OFFLINE') } } });
    }
  });

  router.post('/logout', (req, res)=> {
    req.session.user = null;
    exports.onLogout(req);
    res.json({ ['user:account']: req.session.user });
  });

  router.post('/newUser/:hub', (req, res)=> {
    console.log('requesting new account from ' + req.params.hub);
    var hub = hubs.find('name', req.params.hub);
    // var nKey = nameKeys[req.params.hub];
    // var hubId = nKey && nKey.ws && nKey.ws.id;
    var authWS = wss.orderedClients[hub.id];
    if (authWS) {
      authWS.addListener('user:create', deets=> {
        req.session.user = {
          id: deets.id,
          trusted: deets.verified,
          name: req.body.user,
          hub: {
            id: hub.id,
            name: hub.name,
          },
        };
        //res.cookie('name', 'value', { signed: true });
        res.json({ verified: deets.verified });
      });
      wss.send(hub.id, 'user:create', { user: req.body.user, pass: saltHash.simpleHash(req.body.pass), key: saltHash.simpleHash(req.body.key) });
    }
  });

  provide(exports);
});
