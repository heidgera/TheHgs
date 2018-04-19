var obtains = [
  //`${__dirname}/profile.js`,
  'µ/dataChannel.js',
  'µ/socket.js',
  'µ/events.js',
  `${__dirname}/backend.js`,
];

obtain(obtains, (peers, socket, { Emitter }, { manager })=> {
  exports.newPostCard = (data)=> {
    console.log(data);
    var card = µ('+muse-card', µ('#posts'));
    card.makeTransitionState('slide');

    if (0 && data.title) {
      card.menu = µ('+muse-menu', card);
      card.menu.title = data.title;
    }

    var content = µ('+div', card);
    content.className = 'cardContent';

    if (data.img) {
      card.image = µ('+img', content);
      card.image.src = data.img;
    }

    if (data.text) {
      card.text = µ('+div', content);
      card.text.className = 'postText';
      card.text.textContent = data.text;
    }

    card.postInfo = µ('+div', content);
    card.time = µ('+span', card.postInfo);
    card.time.textContent = new Date(data.timestamp).toLocaleString();
    card.user = µ('+span', card.postInfo);
    card.user.textContent = data.user.name;
  };

  exports.connect = (peer)=> {

  };

  provide(exports);

});
