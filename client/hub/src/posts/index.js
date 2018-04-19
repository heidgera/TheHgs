var obtains = [
  //`./src/accountManagement.js`,
  `${__dirname}/create.js`,
  `${__dirname}/view.js`,
  `${__dirname}/backend.js`,
  `${__dirname}/../hubs.js`,
];

obtain(obtains, (create, view, { manager: postMan }, hubs)=> {

  exports.init = ()=> {
    create.init();

    postMan.onpostdeck((data)=> {
      if (data.forEach) {
        data.forEach(view.newPostCard);
      }
    });
  };

  provide(exports);
});
