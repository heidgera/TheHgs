var sheets = require('./sheets.js');

var sheetID = '1BctInpVBEZDkWnSdx__bPA23yLBRnvf_i55E3dG2EK0';

exports.makeJSON = (res)=> {
  var ret = {};
  sheets.getData(sheetID, 'Sheet1!A2:E', (response)=> {
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      let i = rows.length - 1;
      while (!(rows[i][3].includes('br') || rows[i][3].includes('bt'))) i--;

      //console.log('Time, Type:');
      var row = rows[i];
      var tm = new Date(row[0] + ' ' + row[1]);
      var tmNow = new Date();
      ret.timeSince = ((tmNow.getTime() - tm.getTime()) / 3600000).toFixed(1);

      res.json(ret);
    }
  });
};

exports.handlePostData = (req, res)=> {
  console.log(req.body);
  var obj = req.body;

  console.log(obj.feedType);

  let data = [];
  data[0] = [];
  cells = data[0];

  let range = 'Sheet1!A2:G';

  if (obj.newFeedBegin || obj.newFeedEnd || obj.newDiaper) {
    sheets.getData(sheetID, range, (response)=> {
      var rows = response.values;
      let rowNum = rows.length;
      let newRange = 'Sheet1';
      if (obj.newFeedBegin) {
        let time = new Date(obj.newFeedBegin);
        cells[0] = time.toLocaleDateString();
        cells[1] = time.toLocaleTimeString();
        cells[3] = obj.feedType;
      } else if (obj.newFeedEnd) {
        let time = new Date(obj.newFeedEnd);

        rowNum = rows.length - 1;
        while (!(rows[rowNum][3].includes('br') || rows[rowNum][3].includes('bt'))) rowNum--;
        console.log(rows[rowNum]);
        cells[0] = rows[rowNum][0];
        cells[1] = rows[rowNum][1];
        cells[3] = rows[rowNum][3];
        cells[2] = time.toLocaleTimeString();
        var tm = new Date(cells[0] + ' ' + cells[1]);
        cells[4] = ((time.getTime() - tm.getTime()) / 60000).toFixed(0);
      } else if (obj.newDiaper) {
        let time = new Date(obj.newDiaper);
        cells[0] = time.toLocaleDateString();
        cells[1] = time.toLocaleTimeString();
        cells[3] = obj.diaperType;
      }

      newRange += '!A' + (rowNum + 2);
      console.log(data);

      sheets.putData(sheetID, newRange, data, (resp)=> {
        console.log(resp);
        res.send('refresh');
        res.end('yes');
      });
    });
  }
};

exports.sortData = ()=> {
  var ret = {};
  sheets.getData(sheetID, 'Sheet1!A2:G', (response)=> {
    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      let feedings = [];
      let changings = [];
      for (let i = 0; i < rows.length; i++) {
        if ((rows[i][3].includes('br') || rows[i][3].includes('bt'))) {
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
