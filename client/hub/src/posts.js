var obtains = [
  'µ/dataChannel.js',
];

obtain(obtains, ()=> {

  exports.init = ()=> {
    µ('#postCont').onready = ()=> {
      var fInp = µ('.fileInput', µ('#postCont'))[0];
      var close = µ('.close', µ('#postCont'))[0];
      var card = µ('#createCard', µ('#postCont'));
      var cancel = µ('#cancel', µ('#postCont'));
      var post = µ('#post', µ('#postCont'));

      fInp.addEventListener('change', ()=> {
        console.log('image');
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

    };
  };

  provide(exports);
});
