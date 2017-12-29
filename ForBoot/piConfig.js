exports.config = {
  piFig: {
    /*wifiHotspot: {
      ssid: 'SensorServer',
      password: 'newPass!',
      domainName: 'swingsensors.net',
    },*/
    autoStartNode: true,
    //autostart: true,
    softShutdown: {
      controlPin: 23,
      monitorPin: 24,
      delayTime: 1000,
    },
    gitWatch: true,
    /*wifi: {
      ssid: 'SensorServer',
      password: 'defaultPass',
    },*/
  },
};
