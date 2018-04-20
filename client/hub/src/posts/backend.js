var obtains = [
  //`${__dirname}/profile.js`,
  'µ/events.js',
  `${__dirname}/../hubs.js`,
];

obtain(obtains, ({ Emitter }, { manager })=> {

  if (!window.appData.postManager) {
    class PostManager extends Emitter {
      constructor() {
        super();

        var _this = this;

        manager.onNewConnection((peer)=> {
          peer.on('posts:view', data=> {
            console.log(data);
            this.emit('internal:postdeck', data);
          });

          peer.on('posts:dataurl', (deets)=> {
            var cards = µ('muse-card', µ('#posts'));
            var post = cards.find(card=>card.id == deets.id);
            if (post) {
              post.imgSrc += deets.data;
              if (post.imgSrc.length >= post.fileSize) {
                post.image.src = post.imgSrc;
              }
            }
          });
        });
      }

      onpostdeck(cb) {
        this.on('internal:postdeck', cb);
      }

      onpostfile(cb) {
        this.on('internal:postfile', cb);
      }
      //
      // requestPosts(peer, user) {
      //   return new Promise((resolve, reject)=> {
      //     this.once('internal:postdeck', (data)=> {
      //       if (data && !data.error) res(data);
      //       else rej(data);
      //     });
      //     peer.send('posts:view', { user: user, sup: appData.user });
      //   });
      // }
      //
      // getUserPosts(user) {
      //   var _this = this;
      //   return manager.getChannel({ id: user.hub.id })
      //   .then((hub)=>(_this.requestPosts(hub, user)));
      // }

      request(query) {
        return new Promise((res, rej)=> {
          manager.getChannel(query.hub)
          .then((hub)=> {
            hub.send('posts:view', query);
            hub.once('posts:view', data=> {
              if (data && !data.error) res(data);
              else rej(data);
            });
          }).catch(rej);
        });
      }

      create(data) {
        return new Promise((res, rej)=> {
          if (appData.user) {
            console.log('user:');
            console.log(appData.user);
            manager.getChannel(appData.user.hub).then((peer)=> {
              peer.on('posts:create', (ret)=> {
                console.log('got response');
                if (ret.error) rej(ret.error);
                else res(ret);
              });
              console.log('sending create request');
              console.log('using ' + peer.name);
              console.log(data);
              var post = {
                user: appData.user,
                title: data.title,
                img: (data.img.length < 16384 / 2) ? data.img : '',
                text: data.text,
                tags: data.tags,
                public: data.public,
              };
              if ((data.img.length > 16384 / 2)) {
                post.fileId = appData.user.name + Date.now();
                post.fileSize = data.img.length;
              }

              peer.send('posts:create', post);

              if (post.fileId) {
                console.log(Math.ceil(data.img.length / 8192));
                for (var i = 0; i < Math.ceil(data.img.length / 8192); i++) {
                  peer.send('posts:dataurl', {
                    fileId: post.fileId,
                    data: data.img.slice(i * 8192, (i + 1) * 8192),
                  });
                }
              }
            });

          } else rej({ error: 'NOT_LOGGED_IN' });
        });

      }
    }

    window.appData.postManager = new PostManager();
  }

  exports.manager = window.appData.postManager;

  provide(exports);
});
