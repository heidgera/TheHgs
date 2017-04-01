var sheets = require('./sheets.js');

var sheetID = '1BctInpVBEZDkWnSdx__bPA23yLBRnvf_i55E3dG2EK0';

exports.makeJSON = function(res) {
  var ret = {};
  sheets.getData(sheetID, 'Sheet1!A2:E', function(response) {
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      var i = rows.length - 1;
      console.log(rows[i]);
      while (!(rows[i][3].indexOf('br') >= 0 || rows[i][3].indexOf('bt') >= 0)) i--;

      //console.log('Time, Type:');
      var row = rows[i];
      var tm = new Date(row[0] + ' ' + row[1]);
      var tmNow = new Date();
      ret.timeSince = ((tmNow.getTime() - tm.getTime()) / 3600000).toFixed(1);

      res.json(ret);
    }
  });
};

exports.handlePostData = function(req, res) {
  console.log(req.body);
  var obj = req.body;

  console.log(obj.feedType);

  var data = [];
  data[0] = [];
  cells = data[0];

  var range = 'Sheet1!A2:G';

  if (obj.newFeedBegin || obj.newFeedEnd || obj.newDiaper) {
    sheets.getData(sheetID, range, function(response) {
      var rows = response.values;
      var rowNum = rows.length;
      var newRange = 'Sheet1';
      if (obj.newFeedBegin) {
        var time = new Date(obj.newFeedBegin);
        cells[0] = time.toLocaleDateString();
        cells[1] = time.toLocaleTimeString();
        cells[3] = obj.feedType;
      } else if (obj.newFeedEnd) {
        var time = new Date(obj.newFeedEnd);

        rowNum = rows.length - 1;
        while (!(rows[rowNum][3].indexOf('br') >= 0 || rows[rowNum][3].indexOf('bt') >= 0)) rowNum--;
        console.log(rows[rowNum]);
        cells[0] = rows[rowNum][0];
        cells[1] = rows[rowNum][1];
        cells[3] = rows[rowNum][3];
        cells[2] = time.toLocaleTimeString();
        var tm = new Date(cells[0] + ' ' + cells[1]);
        cells[4] = ((time.getTime() - tm.getTime()) / 60000).toFixed(0);
      } else if (obj.newDiaper) {
        var time = new Date(obj.newDiaper);
        cells[0] = time.toLocaleDateString();
        cells[1] = time.toLocaleTimeString();
        cells[3] = obj.diaperType;
      }

      newRange += '!A' + (rowNum + 2);
      console.log(data);

      sheets.putData(sheetID, newRange, data, function(resp) {
        console.log(resp);
        res.send('refresh');
        res.end('yes');
      });
    });
  }
};

exports.sortData = function() {
  var ret = {};
  sheets.getData(sheetID, 'Sheet1!A2:G', function(response) {
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      var feedings = [];
      var changings = [];
      for (var i = 0; i < rows.length; i++) {
        if ((rows[i][3].indexOf('br') >= 0 || rows[i][3].indexOf('bt') >= 0)) {
          feedings.push(rows[i]);
        } else {
          changings.push(rows[i]);
        }
      }

      sheets.putData(sheetID, 'feedings!A2', feedings);
      sheets.putData(sheetID, 'changings!A2', changings);

    }
  });
};
