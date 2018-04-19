var obtains = [
  //`${__dirname}/profile.js`,
  'µ/dataChannel.js',
  'µ/socket.js',
  'µ/events.js',
];

obtain(obtains, (peers, socket, { Emitter })=> {

  if (!window.appData.hubManager) {
    class HubManager extends Emitter {
      constructor() {
        super();

        var _this = this;

        this.ws = socket.connect(window.location.hostname);
        peers.init(this.ws);

      }

      onNewConnection(cb) {
        peers.onPeerConnect(cb);
      }

      getChannel(info) {
        var _this = this;
        var find = peer=>peer.info && peer.info.uuid == info.id;
        if (!info.id) find = peer=>peer.info.name == info.name;
        return new Promise((res, rej)=> {
          var hub = muse.peers.find(find);
          if (hub) {
            hub.whenConnected = ()=> {res(hub);};
          } else res(_this.connect(info));
        });
      }

      connect(info) {
        var method = `http${muse.useSSL ? 's' : ''}://`;
        var route = (info.id) ? `/hub/byId/${info.id}` : `/hub/${info.name}`;
        this.connecting = true;
        return new Promise((resolve, reject)=> {
          console.log('Asking for connection to ' + info.name);
          post(method + window.location.hostname + route, {})
          .then((res)=> {
            var resp = JSON.parse(res)['cnxn:request'];
            if (resp) {
              peers.getPeer({ remoteId: resp.hubId, passive: true }).whenConnected = (peer)=> {
                resolve(peer);
              };
            } else reject(resp);
          });
        });
      }

    }

    window.appData.hubManager = new HubManager();
  }

  exports.manager = window.appData.hubManager;

  provide(exports);
});
