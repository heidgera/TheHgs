function postJSON(url, obj, cb) {
  var xhttp = new XMLHttpRequest();

  xhttp.open('POST', url);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(obj));
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && cb) {
      cb(JSON.parse(xhttp.response));
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
    µ('#newFeeding').style.opacity = .5;
    data = { newFeedBegin:tm.toString(), feedType:'br' };
    postJSON('/newEvent', data, (res)=> {
      if (res.newFeed) {
        µ('#respText').textContent = 'Recorded end of feeding';
        µ('#newFeeding').style.opacity = 1;
        console.log(res);
      }
    });
  };

  µ('#endFeeding').onclick = ()=> {
    var tm = new Date();
    data = { newFeedEnd:tm.toString() };
    µ('#endFeeding').style.opacity = .5;
    postJSON('/newEvent', data, (res)=> {
      if (res.feedEnd) {
        µ('#respText').textContent = 'Recorded end of feeding';
        µ('#endFeeding').style.opacity = 1;
        console.log(res);
      }
    });
  };

  µ('#poops').onclick = ()=> {
    if (!µ('#poops').clicked) {
      var tm = new Date();
      data = { newDiaper:tm.toString(), diaperType:'v+b' };
      µ('#poops').style.opacity = .5;
      µ('#poops').clicked = true;
      postJSON('/newEvent', data, (res)=> {
        if (res.diaper) {
          µ('#respText').textContent = 'Recorded poops';
          µ('#poops').clicked = false;
          µ('#poops').style.opacity = 1;
          console.log(res);
        }
      });
    }
  };

  µ('#wet').onclick = ()=> {
    if (!µ('#wet').clicked) {
      var tm = new Date();
      data = { newDiaper:tm.toString(), diaperType:'v' };
      µ('#wet').style.opacity = .5;
      µ('#wet').clicked = true;
      postJSON('/newEvent', data, (res)=> {
        if (res.diaper) {
          µ('#respText').textContent = 'Recorded wee-wee';
          µ('#wet').style.opacity = 1;
          µ('#wet').clicked = false;
          
          console.log(res);
        }
      });
    }
  };

  //date.toString()
});
