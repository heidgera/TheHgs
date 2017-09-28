global.obtain = (addr, func)=> {
  var _this = this;
  var objs = [];
  if (addr.length <= 0) func();
  else {
    addr.forEach(function (adr, ind, arr) {
      objs[ind] = require(adr);
    });

    func.apply(null, objs);
  };

};

global.provide = ()=> {};