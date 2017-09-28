'use strict';

obtain([], ()=> {
  exports.app = {};

  exports.app.start = ()=> {
    console.log('started');

    console.log(window.location.hostname);

    //var peer = new Peer('sdfasdfasdfh', { host: window.location.hostname, port: 9000, path: '/freebook' });

    var servers = null;
    var pcConstraint = null;
    var dataConstraint = null;

    var localConnection = new RTCPeerConnection(servers, pcConstraint);
    console.log(servers);
    console.log(pcConstraint);
    var sendChannel = localConnection.createDataChannel('demoPage', dataConstraint);

    localConnection.onicecandidate = (e)=> {
      console.log(e);
    };

    localConnection.createOffer().then((desc)=> {
      console.log(desc);
    });

    //console.log(peer);

    document.onkeypress = (e)=> {
      if (e.key == ' ') console.log('Space pressed');
    };

  };

  provide(exports);
});
