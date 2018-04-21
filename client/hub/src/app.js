'use strict';

window.appData = {};

muse.useSSL = (window.location.protocol == 'https:');
var obtains = [
  //`./src/accountManagement.js`,
  `./src/posts/index.js`,
  `./src/profile.js`,
  `./src/account/index.js`,
  './src/hubs.js',
  'µ/dataChannel.js',
  'µ/socket.js',
  'µ/components/index.js',
];

obtain(obtains, (posts, profile, account, hubs, peers, socket, comps)=> {

  var ws = socket.get(window.location.hostname);
  peers.init(ws);

  exports.app = {};

  exports.app.start = ()=> {
    ws.connect();

    µ('#blurDiv').makeTransitionState('blur');
    µ('#blurDiv').blur = false;

    //user.init();
    posts.init();
    profile.init();
    account.init();

    //login.init();
    console.log('starting...');

    ws.onconnect = ()=> {
      console.log('connected to websocket');
    };

    ws.addListener('route:redirect', (data)=> {
      document.title = data.title;
      history.pushState(appData.user, data.title, data.path);
    });

    ws.addListener('route:error', (msg)=> {
      console.log(msg);
    });

    document.onkeypress = (e)=> {
      if (e.key == ' ') console.log('Space pressed');
    };

  };

  provide(exports);
});
