var obtains = [
];

obtain(obtains, ()=> {
  exports.elements = {};
  var bin = exports.elements;

  var addField = (div, label, type = 'text')=> {
    var ret = {};
    // µ('+div', div).textContent = label;
    // µ('+br', div);
    ret.field = µ('+input', div);
    ret.field.type = type;
    ret.field.placeholder = label;
    ret.field.autocapitalize = 'off';
    µ('+br', div);
    µ('+br', div);
    ret.output = µ('+div', div);
    ret.output.className = 'textReply';
    µ('+br', div);
    return ret;
  };

  var setStateDiv = (div, holder, which)=> {
    div.main = µ('+muse-div', holder);
    div.main.className = 'fadeDiv';

    div.name = addField(div.main, 'Username');
    div.hub = addField(div.main, 'Hubname');
    if (which) div.key = addField(div.main, 'Hub Key');
    div.pass = addField(div.main, 'Password', 'password');
    if (which) div.conf = addField(div.main, 'Confirm Password', 'password');

    div.accept = µ('+but-ton', div.main);
    div.accept.textContent = ((which) ? 'Create Account' : 'Login');

    µ('+div', div.main).className = 'dividr';
    div.switch = µ('+div', div.main);
    div.switch.textContent = ((!which) ? 'Create Account' : 'Login');
    div.switch.className = 'noteText';

    div.main.makeTransitionState('show', 'hide');
  };

  var createElements = ()=> {
    bin.card = µ('+muse-card', µ('#loginCont'));
    bin.card.id = 'loginCard';

    bin.menu = µ('+muse-menu', bin.card);
    bin.menu.title = 'Sign into your account';

    var content = µ('+div', bin.card);
    content.className = 'cardContent';

    bin.LogIn = {};
    bin.Create = {};
    setStateDiv(bin.LogIn, content);
    setStateDiv(bin.Create, content, true);

    bin.LogIn.main.show = true;
  };

  var reset = ()=> {
    µ('input', bin.card).forEach(el=>el.value = '');
    µ('.textReply', bin.card).forEach(el=>el.textContent = '');
  };

  var setActions = ()=> {

    µ('input', bin.card).forEach(el=> {
      el.onkeypress = (e)=> {
        if (e.keyCode == 13) bin.LogIn.accept.onclick();
      };
    });

    bin.LogIn.accept.onclick = ()=> {
      µ('.textReply', bin.card).forEach(el=>el.textContent = '');
      if (µ('input', bin.LogIn.main).reduce((acc, el)=>(el.value.length > 0) && acc, true)) {
        console.log('logging in');

        post(`http${muse.useSSL ? 's' : ''}://${window.location.hostname}/auth/${bin.LogIn.hub.field.value}`, {
          user: bin.LogIn.name.field.value,
          pass: bin.LogIn.pass.field.value,
        }).then((res)=> {
          console.log('here');
          exports.handleData(JSON.parse(res)['user:account']);
        });

        bin.card.opened = false;
      } else {
        bin.LogIn.pass.output.textContent = 'Please fill in all fields';
      }

    };

    bin.card.makeTransitionState('show', 'hide');

    bin.card.onShow = ()=> {
    };

    bin.card.onClickOutsideCard = (e)=> {
    };

    bin.card.onHide = ()=> {
    };

    bin.LogIn.main.onHide = ()=> {
      bin.Create.main.show = true;
      bin.menu.title = 'Create an account';
    };

    bin.Create.main.onHide = ()=> {
      bin.LogIn.main.show = true;
      bin.menu.title = 'Sign in';
    };

    bin.LogIn.switch.onclick = ()=> {
      bin.LogIn.main.show = false;
    };

    bin.Create.switch.onclick = ()=> {
      bin.Create.main.show = false;
    };
  };

  exports.init = ()=> {
    /*µ('#acctMgmt').onready = ()=> {
      µ('#loginOpts').opened = !appData.user;
    };*/
    createElements();
    setActions();

  };

  var onLogout = ()=> {
    µ('#account').innerHTML = '';
    µ('#account').textContent = 'Sign In';
    µ('#account').onclick = null;

    exports.onLogout();
  };

  var onLogin = (user)=> {
    createAccountDrop(user);

    µ('#account').onclick = ()=> {
      console.log('logging out');

      post(`http${muse.useSSL ? 's' : ''}://${window.location.hostname}/logout`, {})
      .then((res)=> {
        reset();
        bin.card.opened = true;
        onLogout();
        exports.handleData(JSON.parse(res)['user:account']);
      });
    };
  };

  exports.onLogout = ()=> {

  };

  exports.onLogin = (user)=> {

  };

  exports.handleProfileData = (data)=> {
    onLogin(data);
  };

  exports.handleData = (data)=> {
    if (data && data.error) {
      if (data.error.type == 'NO_HUB') {
        bin.LogIn.hub.output.textContent = 'No such hub.';
      } else if (data.error.type == 'HUB_OFFLINE') {
        bin.LogIn.hub.output.textContent = 'Hub is offline.';
      }
    } else {
      appData.user = data;
      bin.card.show = !(data && data.trusted);
      µ('body')[0].className = (!!data ? 'loggedIn' : 'loggedOut');
      if (data && data.trusted) {

      } else if (data) {
        bin.LogIn.pass.output.textContent = 'Username and password do not match';
      }

    }

  };

  provide(exports);
});
