include(['./config.js', './websocket.js'], function() {
  wsClient.connect();

  µ('#lampOn').onclick = function() {
    wsClient.send('lampState=1');
  };

  µ('#lampOff').onclick = function() {
    wsClient.send('lampState=0');
  };
});
