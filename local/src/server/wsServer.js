if (!window) var window = global;

obtain([`${__dirname}/express.js`, 'ws', 'url'], ({ httpServer, httpsServer, sessionParser }, { Server }, url)=> {
  if (!window.wsServer) {
    window.wsServer = new Server({
      verifyClient: (info, done) => {
        sessionParser(info.req, {}, () => {
          done(true);
        });
      },

      server: (muse.useSSL ? httpsServer : httpServer), });
    var webSock = null;

    wsServer.broadcast = function (data) {
      wsServer.clients.forEach(function each(client) {
        client.send(data);
      });
    };

    wsServer.orderedClients = [];

    var listeners = {};

    wsServer.addListener = (evt, cb)=> {
      listeners[evt] = cb;
    };

    wsServer.send = (_id, obj)=> {
      wsServer.orderedClients[_id].send(JSON.stringify(obj));
    };

    var orderedCallbacks = {};

    wsServer.onOrderedConnect = (_id, cb)=> {
      orderedCallbacks[_id] = cb;
    };

    wsServer.onClientConnect = (ws)=> {};

    wsServer.onClientDisconnect = (ws)=> {};

    wsServer.on('connection', function (ws, req) {
      //console.log('client connected');
      if (!req && ws.upgradeReq) req = ws.upgradeReq;
      wsServer.onClientConnect(ws, req);
      ws.on('message', function (message) {
        //console.log(message);
        var data = JSON.parse(message);
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            if (key == '_id') {
              ws._id = data._id;
              console.log(`Client #${ws._id} connected`);
              wsServer.orderedClients[data._id] = ws;
              if (orderedCallbacks[data._id]) orderedCallbacks[data._id]();
            } else if (key == 'timeSync') {
              ws.send(JSON.stringify({ serverTime: Date.now() }));
            } else if (key in listeners) listeners[key](data[key], data, ws);
          }
        }
      });

      ws.on('close', function () {
        wsServer.onClientDisconnect(req);
      });

      ws.on('error', function (error) {
      });
    });
  }

  exports.wss = wsServer;

  provide(exports);
});
