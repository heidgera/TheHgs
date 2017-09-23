obtain(['wemo-client'], (Wemo)=> {
  var wemo = new Wemo();

  var Device = function (name) {
    const _this = this;

    _this.client = null;

    _this.name = name;

    _this.turnOn = ()=> {
      _this.client && _this.client.setBinaryState(1);
    };

    _this.turnOff = ()=> {
      _this.client && _this.client.setBinaryState(0);
    };

    _this.setState = (state)=> {
      _this.client && _this.client.setBinaryState(state);
    };

    _this.onStateChange = ()=> {};
  };

  exports.devices = {};

  exports.devices.sunroomLamp = new Device('Sunroom');

  wemo.discover(function (err, deviceInfo) {
    console.log('Wemo Device Found: %j', deviceInfo);

    for (var device in exports.devices) {
      if (exports.devices.hasOwnProperty(device)) {
        if (exports.devices[device].name == deviceInfo.friendlyName) {
          exports.devices[device].client = wemo.client(deviceInfo);

          exports.devices[device].client.on('error', function (err) {
            console.log('Error: %s', err.code);
          });

          // Handle BinaryState events
          exports.devices[device].client.on('binaryState', exports.devices[device].onStateChange);
        }
      }
    }

  });
});
