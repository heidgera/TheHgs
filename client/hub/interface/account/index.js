var obtains = [
  'µ/components/index.js',
  `./src/userManagement.js`,
];

obtain(obtains, (comps, user, { Import })=> {
  var exports = {};

  var setLoginOptsStartPos = ()=> {
    var rect = µ('#loginIcon').getBoundingClientRect();
    µ('#loginOpts').style.removeProperty('--button-pos-x');
    µ('#loginOpts').style.setProperty('--button-pos-x', (window.innerWidth - rect.left) + 'px');
    µ('#loginOpts').style.removeProperty('--button-pos-y');
    µ('#loginOpts').style.setProperty('--button-pos-y', rect.bottom + 'px');
  };

  Import.onready = ()=> {
    var remote = window.location.pathname;

    remote = remote.replace('/hub/', '');

    setLoginOptsStartPos();
    µ('#accept').onclick = ()=> {
      console.log('logging in');

      post(`http${muse.useSSL ? 's' : ''}://${window.location.hostname}/auth/${µ('#hubname').value}`, {
        user: µ('#user').value,
        pass: µ('#password').value,
      }).then((res)=> {
        console.log('here');
        user.handleData(JSON.parse(res)['user:account']);
        // window.appData.user = ret['user:account'];
        // console.log(window.appData.user);
        // µ('body')[0].className = (!!window.appData.user ? 'loggedIn' : 'loggedOut');
      });

      µ('#loginOpts').opened = false;
    };

    µ('#logout').onclick = ()=> {
      console.log('logging out');

      post(`http${muse.useSSL ? 's' : ''}://${window.location.hostname}/logout`, {})
      .then((res)=> {
        user.handleData(JSON.parse(res)['user:account']);
        // window.appData.user = res['user:account'];
        // µ('body')[0].className = (!!window.appData.user ? 'loggedIn' : 'loggedOut');
      });

      µ('#loginOpts').opened = false;
    };

    µ('#loginIcon').onclick = (e)=> {
      e.stopPropagation();
      //setWifiOptsStartPos();
      µ('#loginOpts').opened = !µ('muse-card')[0].opened;
    };

    µ('#loginOpts').makeTransitionState('opened', 'closed');

    µ('#loginOpts').onOpened = ()=> {
      µ('#loginIcon').classList.add('opened');
    };

    µ('#loginOpts').onClickOutsideCard = (e)=> {
      if (µ('#loginOpts').opened) µ('#loginOpts').opened = false;
    };

    µ('#loginOpts').onClosed = ()=> {
      µ('#loginIcon').classList.remove('opened');
    };
  };

  provide(exports);
});
