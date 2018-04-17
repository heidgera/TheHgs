var obtains = [
];

obtain(obtains, (profile)=> {

  exports.init = ()=> {
    µ('#profileCont').onready = ()=> {
      µ('#profileCard').makeTransitionState('show');
      µ('#profileCard').show = false;

      µ('.close', µ('#profileCard'))[0].onclick = ()=> {
        µ('#profileCard').show = false;
        µ('#blurDiv').blur = false;
      };
    };
  };

  provide(exports);
});
