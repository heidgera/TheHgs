var obtains = [
  'express',
  'body-parser',
  'fs',
  'express-fileupload',
  'https',
];

obtain(obtains, (express, bodyParser, fs, fileUpload, https)=> {
  var fileServer = express();
  var router = express.Router();

  router.use(bodyParser.json());
  router.use(fileUpload());

  fileServer.use('', express.static(`${global.tld}/client`));
  fileServer.use('/common', express.static(`${global.tld}/common`));

  // const options = {
  //   cert: fs.readFileSync('./sslcert/fullchain.pem'),
  //   key: fs.readFileSync('./sslcert/privkey.pem'),
  // };

  fileServer.start = ()=> {
    fileServer.use(router);
    fileServer.listen(80, function () {
      console.log('listening on 80');
    });

    //https.createServer(options, fileServer).listen(443);
  };

  exports.fileServer = fileServer;
  exports.router = router;
  exports.express = express;
});
