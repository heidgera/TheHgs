function postJSON(url, obj, cb) {
  var xhttp = new XMLHttpRequest();

  xhttp.open('POST', url);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(obj));
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && cb) {
      cb(xhttp.responseXML);
    }

    //window.location = xhttp.responseText;
  };
}

include(['./config.js'], function() {
  get('/babyTimes.json').then((resp)=> {
    µ('#lastTime').textContent = JSON.parse(resp).timeSince;
  });

  µ('#newFeeding').onclick = ()=> {
    var tm = new Date();
    data = { newFeedBegin:tm.toString(), feedType:'br' };
    postJSON('/newEvent', data, (res)=> {
      console.log(res);
    });
  };

  µ('#endFeeding').onclick = ()=> {
    var tm = new Date();
    data = { newFeedEnd:tm.toString() };
    postJSON('/newEvent', data, (res)=> {
      console.log(res);
    });
  };

  µ('#poops').onclick = ()=> {
    var tm = new Date();
    data = { newDiaper:tm.toString(), diaperType:'v+b' };
    postJSON('/newEvent', data, (res)=> {
      console.log(res);
    });
  };

  µ('#wet').onclick = ()=> {
    var tm = new Date();
    data = { newDiaper:tm.toString(), diaperType:'v' };
    postJSON('/newEvent', data, (res)=> {
      console.log(res);
    });
  };

  //date.toString()
});
