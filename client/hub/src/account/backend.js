var obtains = [
  //`${__dirname}/profile.js`,
  'µ/dataChannel.js',
  'µ/socket.js',
];

obtain(obtains, (peers, socket)=> {

  if (!window.appData.accountManager) {
    class AccountManager extends EventTarget {
      constructor() {
        super();

        var _this = this;

        this.ws = socket.connect(window.location.hostname);
        peers.init(this.ws);

        this.ws.addListener('user:account', (data)=> {
          _this.handleLogin(data);
        });
      }

      set onlogin(cb) {
        this.addEventListener('login', (e)=> {
          cb(e.detail);
        });
      }

      set onlogout(cb) {
        this.addEventListener('logout', cb);
      }

      set onloginerror(cb) {
        this.addEventListener('error', (e)=> {
          cb(e.detail);
        });
      }

      handleLogin(data) {
        var _this = this;
        if (data && data.error) {
          this.dispatchEvent(new CustomEvent('error', { detail: data.error }));
        } else {
          appData.user = data;
          if (data && data.trusted) {
            appData.user = data;
            console.log(data);
            post(`http${muse.useSSL ? 's' : ''}://${window.location.hostname}/hub/${data.hub.name}`, {})
            .then((res)=> {
              console.log('Requesting Home Connection');
              if (data.hub.cnxnId) {
                _this.home = peers.getPeer({ remoteId: data.hub.cnxnId, passive: true });
                _this.home.onconnect = ()=> {
                  _this.home.send('profile:view', { user: appData.user });
                };

                _this.home.addListener('profile:view', usr=> {
                  console.log(usr);
                  if (usr.id == data.id)
                    _this.dispatchEvent(new CustomEvent('login', { detail: usr }));
                });
              }
            });
          } else if (data) {
            this.dispatchEvent(new CustomEvent('error', { detail: { type: 'PASSWORD' } }));
          } else {
            this.dispatchEvent(new CustomEvent('logout', { detail: false }));
          }

        }
      }

      login (user, hub, pass) {
        var _this = this;
        console.log('trying to login');
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
