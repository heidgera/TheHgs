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

      var imgSrc = '';

      img.src = '';

      card.makeTransitionState('show', 'hide');

      lInp.onblur = ()=> {
        img.src = lInp.value;
        imgSrc = lInp.value;
      };

      fInp.addEventListener('change', ()=> {
        if (fInp.files && fInp.files[0]) {
          var FR = new FileReader();

          var img = µ('.imgDisplay', µ('#postCont'))[0];

          img.onload = function () {

            var oc = document.createElement('canvas'),
                octx = oc.getContext('2d');

            octx.imageSmoothingQuality = 'medium';
            octx.imageSmoothingEnabled = true;

            oc.width = 1000;//img.width * 0.5; 1000/wid = fin/hgt
            oc.height = 1000 * img.height / img.width;
            octx.drawImage(img, 0, 0, oc.width, oc.height);

            img.src = oc.toDataURL();
            imgSrc = img.src;

            img.onload = ()=> {
              console.log('resized');
            };
          };

          FR.addEventListener('load', function (e) {
            img.src = e.target.result;
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
          img: imgSrc,
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
