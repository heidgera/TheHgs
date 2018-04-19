var obtains = [
  //`${__dirname}/profile.js`,
  'µ/dataChannel.js',
  'µ/socket.js',
  'µ/events.js',
  `${__dirname}/../hubs.js`,
];

obtain(obtains, (peers, socket, { Emitter }, hubs)=> {

  if (!window.appData.accountManager) {
    class AccountManager extends Emitter {
      constructor() {
        super();

        var _this = this;

        this.ws = socket.connect(window.location.hostname);
        peers.init(this.ws);

        this.ws.on('user:account', (data)=> {
          _this.handleLogin(data);
        });
      }

      set onlogin(cb) {
        this.on('login', cb);
      }

      set onlogout(cb) {
        this.on('logout', cb);
      }

      set onloginerror(cb) {
        this.on('error', cb);
      }

      handleLogin(data) {
        var _this = this;
        if (data && data.error) {
          this.emit('error',  data.error);
        } else {
          appData.user = data;
          if (data && data.trusted) {
            appData.user = data;
            hubs.manager.getChannel(data.hub).then((hub)=> {
              _this.home = hub;
              _this.home.on('profile:view', usr=> {
                console.log(usr);
                if (usr.id == data.id)
                  _this.emit('login',  usr);
              });
              _this.home.send('profile:view', { user: appData.user });
            });
            // post(`http${muse.useSSL ? 's' : ''}://${window.location.hostname}/hub/byId/${data.hub.id}`, {})
            // .then((res)=> {
            //   // console.log('Made connection request');
            //   // peers.onPeerAdded((peer)=> {
            //   //   console.log(peer);
            //   //   console.log(data.hub.cnxnId);
            //   //   if (peer.id == data.hub.cnxnId) console.log('home');
            //   //   peer.onconnect = ()=> {
            //   //     console.log('connected');
            //   //   };
            //   // });
            //   var resp = JSON.parse(res)['cnxn:request'];
            //   if (resp) {
            //     _this.home = peers.getPeer({ remoteId: resp.hubId, passive: true });
            //     _this.home.onconnect = ()=> {
            //       console.log('connected to home');
            //       _this.home.send('profile:view', { user: appData.user });
            //     };
            //
            //     _this.home.on('profile:view', usr=> {
            //       console.log(usr);
            //       if (usr.id == data.id)
            //         _this.emit('login',  usr);
            //     });
            //   }
            // });
          } else if (data) {
            this.emit('error', { type: 'PASSWORD' });
          } else {
            if (_this.home) _this.home.close();
            console.log('emitted logout');
            this.emit('logout',  false);
          }

        }
      }

      login (user, hub, pass) {
        var _this = this;
        console.log('trying to login as ' + user);
        post(`http${muse.useSSL ? 's' : ''}://${window.location.hostname}/auth/${hub}`, {
          user: user,
          pass: pass,
        }).then((res)=> {
          _this.handleLogin(JSON.parse(res)['user:account']);
        });
      }

      logout () {
        var _this = this;
        post(`http${muse.useSSL ? 's' : ''}://${window.location.hostname}/logout`, {})
        .then((res)=> {
          _this.handleLogin(JSON.parse(res)['user:account']);
        });
      }
    }

    window.appData.accountManager = new AccountManager();
  }

  exports.manager = window.appData.accountManager;

  provide(exports);
});
