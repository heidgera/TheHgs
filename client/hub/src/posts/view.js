var obtains = [
  //`${__dirname}/profile.js`,
  'µ/dataChannel.js',
  'µ/socket.js',
  'µ/events.js',
  `${__dirname}/backend.js`,
];

obtain(obtains, (peers, socket, { Emitter }, { manager })=> {
  var slides = 0;
  exports.newPostCard = (data)=> {
    console.log(data);

    var card = µ('+muse-card', µ('#posts'));
    card.makeTransitionState('slide');
    card.id = data.id;

    if (data.fileSize) {
      card.imgSrc = '';
      card.fileSize = data.fileSize;
    }

    card.slide = false;

    if (data.title) {
      card.menu = µ('+muse-menu', card);
      card.menu.title = data.title;

      // card.heart = µ('+span', card.menu);
      // card.heart.textContent = '♡';
      //
      // card.heart.onclick = ()=> {
      //   console.log('here');
      //   card.heart.textContent = '♥';
      //   card.heart.style.color = '#700';
      // };
    }

    var content = µ('+div', card);
    content.className = 'cardContent';

    if (data.img || data.fileSize) {
      card.image = µ('+img', content);
      if (data.img) card.image.src = data.img;
    }

    if (data.text) {
      card.text = µ('+div', content);
      card.text.className = 'postText';
      card.text.textContent = data.text;
    }

    card.postInfo = µ('+div', content);
    card.postInfo.className = 'postInfo';
    card.time = µ('+span', card.postInfo);
    card.time.className = 'postDate';
    card.time.textContent = new Date(data.timestamp).toLocaleString();
    card.user = µ('+span', card.postInfo);
    card.user.className = 'postAuthor';
    card.user.textContent = data.user.name;

    slides++;
    setTimeout(()=> {
      card.slide = true;
      slides--;
    }, 100 * slides);

    return card;
  };

  exports.connect = (peer)=> {

  };

  provide(exports);

});
