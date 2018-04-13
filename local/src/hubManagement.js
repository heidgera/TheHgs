if (!window) var window = global;

var obtains = [
  `${__dirname}/saltHash.js`,
  'uuid/v4',
  'fs',
];

obtain(obtains, (saltHash, uuidv4, fs)=> {
  var hubList = './.hubList.json';

  if (!window.appData.hubs) {
    window.appData.hubs = [];
    if (fs.existsSync(hubList)) {
      window.appData.hubs = JSON.parse(fs.readFileSync(hubList)).hubs;
    }
  }

  var pubInfo = (hub)=> {
    return {
      name: hub.name,
      uuid: hub.uuid,
    };
  };

  var add = (info)=> {
    var sHash = saltHash.generate(info.key);
    var newHub = {
      name: info.name,
      uuid: info.id,
      id: info.cnxnId,
      hash: sHash.hash,
      salt: sHash.salt,
      ws: info.ws,
    };
    window.appData.hubs.push(newHub);
    var simple = window.appData.hubs.map(hub=> {return { name: hub.name, uuid: hub.uuid, hash: hub.hash, salt: hub.salt };});
    fs.writeFileSync(hubList, JSON.stringify({ hubs: simple }));

    return newHub;
  };

  // exports.update = (info)=> {
  //
  // };

  exports.find = (key, value)=> window.appData.hubs.find(hub=>hub[key] == value);

  exports.register = (info)=> {
    if (!info.id) info.id = uuidv4();
    var byName = exports.find('name', info.name);
    var byId = exports.find('uuid', info.id);

    if (!byName && !byId) return pubInfo(add(info));
    else if (byName == byId && saltHash.check(info.key, byId.salt, byId.hash)) {
      byId.ws = info.ws;
      byId.id = info.cnxnId;
      return pubInfo(byId);
    } else if (!byName && saltHash.check(info.key, byId.salt, byId.hash)) {
      console.log('updating name');
      byId.name = info.name;
      byId.ws = info.ws;
      byId.id = info.cnxnId;
      return pubInfo(byId);
    } else return false;
  };
});

//{name: '', id: 'ws', hash: '', salt: '', ws: ''}
