'use strict';

window.appData = {};

//muse.useSSL = true;
var obtains = [
  //`./src/accountManagement.js`,
  `./src/posts.js`,
  `./src/account/index.js`,
  'µ/dataChannel.js',
  'µ/socket.js',
  'µ/components/index.js',
];

obtain(obtains, (posts, account, peers, socket, comps)=> {

  exports.app = {};

  exports.app.start = ()=> {
    var ws = socket.connect(window.location.hostname);

    µ('#blurDiv').makeTransitionState('blur');
    µ('#blurDiv').blur = false;

    //user.init();
    posts.init();
    account.init();
    //login.init();
    console.log('starting...');

    ws.onconnect = ()=> {
      console.log('connected to websocket');
    };

    // ws.addListener('setId', (id)=> {
    //   console.log('Set id to ' + id);
    //   ws.id = id;
    // });

    ws.addListener('route:redirect', (data)=> {
      document.title = data.title;
      history.pushState(appData.user, data.title, data.path);
    });

    ws.addListener('error', (msg)=> {
      console.log(msg);
    });

    document.onkeypress = (e)=> {
      if (e.key == ' ') console.log('Space pressed');
    };

  };

  provide(exports);
});
