var obtains = [
  `${__dirname}/../account/backend.js`,
  `${__dirname}/backend.js`,
];

obtain(obtains, (manager, { manager: postMan })=> {

  exports.init = ()=> {
    µ('#postCont').onready = ()=> {
      var fInp = µ('.fileInput', µ('#postCont'))[0];
      var lInp = µ('.linkInput', µ('#postCont'))[0];
      var close = µ('.close', µ('#postCont'))[0];
      var card = µ('#createCard', µ('#postCont'));
      var cancel = µ('#cancel', µ('#postCont'));
      var post = µ('#post', µ('#postCont'));

      var title = µ('.titleInput', µ('#postCont'))[0];
      var img = µ('.imgDisplay', µ('#postCont'))[0];
      var text = µ('#text', µ('#postCont'));
      var pub = µ('#public', µ('#postCont'));

      img.src = null;

      card.makeTransitionState('show', 'hide');

      lInp.onblur = ()=> {
        img.src = lInp.value;
      };

      fInp.addEventListener('change', ()=> {
        if (fInp.files && fInp.files[0]) {
          var FR = new FileReader();

          FR.addEventListener('load', function (e) {
            µ('.imgDisplay', µ('#postCont'))[0].src = e.target.result;
          });

          FR.readAsDataURL(fInp.files[0]);
        }

      });

      cancel.onclick = close.onclick = ()=> {
        card.show = false;
        µ('#blurDiv').blur = false;
      };

      /*
      title: data.title,
      img: data.img,
      text: data.text,
      tags: data.tags,
      public: data.public,
      */

      post.onclick = ()=> {
        postMan.create({
          title: title.value,
          img: img.src,
          text: text.value,
          tags: ['default'],
          public: pub.checked,
        }).then((pst)=> {
          card.show = false;
          console.log(pst);
        }).catch(err=> {
          console.log(err);
        });
      };

      manager.onlogin = (user)=> {

      };

    };
  };

  provide(exports);
});
