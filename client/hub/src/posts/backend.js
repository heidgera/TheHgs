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
            this.emit('internal:postdeck', data);
          });
        });
      }

      onpostdeck(cb) {
        this.on('internal:postdeck', cb);
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
              peer.send('posts:create', {
                user: appData.user,
                title: data.title,
                img: data.img,
                text: data.text,
                tags: data.tags,
                public: data.public,
              });
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
