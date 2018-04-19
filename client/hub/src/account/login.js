var obtains = [
  `${__dirname}/backend.js`,
];

obtain(obtains, ({ manager })=> {
  exports.elements = {};
  var bin = exports.elements;

  var setupActions = ()=> {
    µ('input', bin.card).forEach(el=> {
      el.onkeypress = (e)=> {
        if (e.keyCode == 13) bin.Login.accept.onclick();
      };
    });

    bin.Login.main.makeTransitionState('show', 'hide');
    bin.SignUp.main.makeTransitionState('show', 'hide');

    bin.Login.accept.onclick = ()=> {
      console.log('login click');
      exports.clearMessages();
      µ('input:after', bin.card).forEach(el=>el.textContent = '');
      if (µ('input', bin.Login.main).reduce((acc, el)=>(el.value.length > 0) && acc, true)) {
        manager.login(bin.Login.Username.value, bin.Login.Hubname.value, bin.Login.Password.value);
      } else {
        bin.Login.Password.output.textContent = 'Please fill all fields';
      }

    };

    manager.onloginerror = (err)=> {
      if (err.type == 'PASSWORD')
        bin.Login.Password.output.textContent = 'Username and Password do not match';
    };

    manager.onlogin = (user)=> {
      console.log('logged in');
      bin.card.show = false;
    };

    manager.onlogout = ()=> {
      console.log('here');
      //bin.card.show = true;
    };

    if (!bin.card.setup) bin.card.makeTransitionState('show', 'hide');
    bin.card.setup = true;

    bin.card.onShow = ()=> {
    };

    bin.card.onClickOutsideCard = (e)=> {
    };

    bin.card.onHide = ()=> {
    };

    bin.Login.main.onHide = ()=> {
      bin.SignUp.main.show = true;
      bin.menu.title = 'Create an account';
    };

    bin.SignUp.main.onHide = ()=> {
      bin.Login.main.show = true;
      bin.menu.title = 'Sign into your account';
    };

    bin.Login.switch.onclick = ()=> {
      bin.Login.main.show = false;
    };

    bin.SignUp.switch.onclick = ()=> {
      bin.SignUp.main.show = false;
    };
  };

  exports.reset = ()=> {
    µ('input', bin.card).forEach(el=> {
      el.value = '';
      bin.Login.Password.output.textContent = '';
    });
  };

  exports.clearMessages = ()=> {
    µ('input', bin.card).forEach(el=> {
      bin.Login.Password.output.textContent = '';
    });
  };

  exports.init = ()=> {
    µ('#loginCont').onready = ()=> {
      console.log('Login box ready');
      var div = µ('#loginCont');
      bin.card = µ('muse-card', div)[0];
      bin.menu = µ('muse-menu', div)[0];

      bin.Login = {};
      bin.SignUp = {};

      bin.Login.main = µ('#loginDiv', div);
      bin.SignUp.main = µ('#createDiv', div);

      µ('input', bin.Login.main).forEach((inp)=> {
        bin.Login[inp.placeholder] = inp;
        inp.output = inp.parentNode.insertBefore(µ('+div'), inp.nextSibling);
      });

      µ('input', bin.SignUp.main).forEach((inp)=> {
        inp.output = inp.parentNode.insertBefore(µ('+div'), inp.nextSibling);
      });

      bin.Login.accept = µ('but-ton', bin.Login.main)[0];
      bin.SignUp.accept = µ('but-ton', bin.SignUp.main)[0];

      bin.Login.switch = µ('#signup', bin.Login.main);
      bin.SignUp.switch = µ('#signin', bin.SignUp.main);

      setupActions();
    };
  };

  provide(exports);
});
