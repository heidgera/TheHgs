var obtains = [
  `${__dirname}/backend.js`,
];

obtain(obtains, ({ manager })=> {
  exports.elements = {};
  var bin = exports.elements;

  manager.onlogin = (user)=> {
    bin.icon.src = user.icon;
  };

  exports.init = ()=> {
    µ('#account').onready = ()=> {
      bin.icon = µ('.smallUser', µ('#account'))[0];
      bin.card = µ('muse-card', µ('#account'))[0];
      bin.logout = µ('#logout', µ('#account'));
      bin.profile = µ('#profile', µ('#account'));
      bin.post = µ('#add', µ('#account'));

      bin.icon.onclick = ()=> {
        bin.card.show = true;
      };

      bin.card.makeTransitionState('show');

      var rect = bin.icon.getBoundingClientRect();
      bin.card.style.removeProperty('--icon-pos-x');
      bin.card.style.setProperty('--icon-pos-x', (window.innerWidth - rect.right) + 'px');
      bin.card.style.removeProperty('--icon-pos-y');
      bin.card.style.setProperty('--icon-pos-y', rect.bottom + 'px');

      bin.card.onClickOutsideCard = (e)=> {
        if (e.target != bin.icon) bin.card.show = false;
      };

      bin.post.onclick = ()=> {
        if (µ('#createCard')) µ('#createCard').show = true;
        bin.card.show = false;
        µ('#blurDiv').blur = true;
      };

      bin.profile.onclick = ()=> {
        if (µ('#profileCard')) µ('#profileCard').show = true;
        bin.card.show = false;
        µ('#blurDiv').blur = true;
      };

      bin.logout.onclick = ()=> {
        manager.logout();
      };
    };
  };

  provide(exports);
});
