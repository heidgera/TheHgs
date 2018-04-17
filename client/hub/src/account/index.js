var obtains = [
  //`./src/accountManagement.js`,
  `${__dirname}/login.js`,
  `${__dirname}/dropdown.js`,
  `${__dirname}/backend.js`,
];

obtain(obtains, (login, drop, { manager })=> {
  exports.init = ()=> {
    login.init();
    drop.init();
  };

  exports.manager = manager;
  exports.login = login;
  exports.drop = drop;

  provide(exports);
});
